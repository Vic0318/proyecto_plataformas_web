from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from .models import Usuario, PerfilEmpresa, PerfilFreelance, Producto, Pedido, DetallePedido
import json

User = get_user_model()

def get_product_category(name):
    name_lower = name.lower()
    if any(k in name_lower for k in ['jugo', 'agua', 'bebida', 'cola', 'soda']):
        return 'Bebidas'
    elif any(k in name_lower for k in ['detergente', 'jabon', 'limpieza', 'desinfectante', 'cloro']):
        return 'Limpieza'
    return 'Abarrotes'

def get_product_image(name, category):
    # Default mock images as configured in Next.js public folder
    if category == 'Bebidas':
        return '/beverages_pack.png'
    elif category == 'Limpieza':
        return '/cleaning_pack.png'
    return '/groceries_pack.png'

@csrf_exempt
def api_login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    
    try:
        data = json.loads(request.body)
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return JsonResponse({'error': 'El correo electrónico no está registrado.'}, status=400)
        
        if not user.check_password(password):
            return JsonResponse({'error': 'Contraseña incorrecta.'}, status=400)
        
        # Determine name to display
        name = user.username
        if user.rol == Usuario.Rol.TENDERO:
            name = "Abarrotes Don Pepe"
        elif user.rol == Usuario.Rol.EMPRESA:
            try:
                name = user.perfil_empresa.nombre_empresa
            except PerfilEmpresa.DoesNotExist:
                name = "Distribuidora Mayorista ISBEN"
        elif user.rol == Usuario.Rol.FREELANCER:
            name = "Carlos Vendedor Freelance"
        elif user.rol == Usuario.Rol.ADMIN:
            name = "Administrador Sistema"
            
        return JsonResponse({
            'username': user.username,
            'email': user.email,
            'rol': user.rol.lower(),  # Convert to lowercase to match frontend "tendero", "empresa", etc.
            'name': name
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def api_productos(request):
    if request.method == 'GET':
        products_list = []
        for p in Producto.objects.all().select_related('empresa__perfil_empresa'):
            # Determine company name
            try:
                co_name = p.empresa.perfil_empresa.nombre_empresa
            except Exception:
                co_name = "Distribuidora Mayorista ISBEN"
                
            category = get_product_category(p.nombre)
            image_url = p.vista_previa.url if p.vista_previa else get_product_image(p.nombre, category)
            
            products_list.append({
                'id': str(p.id),
                'name': p.nombre,
                'category': category,
                'pricePerUnit': float(p.precio),
                'unitPackName': p.descripcion if p.descripcion else "Lote / Paca mayorista",
                'stock': p.stock,
                'image': image_url,
                'companyName': co_name,
                'isLowStock': p.stock <= p.umbral_bajo_stock
            })
        return JsonResponse(products_list, safe=False)
        
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Find the company user
            company_name = data.get('companyName', 'Distribuidora Mayorista ISBEN')
            try:
                profile = PerfilEmpresa.objects.filter(nombre_empresa__icontains=company_name).first()
                if profile:
                    company_user = profile.usuario
                else:
                    company_user = User.objects.filter(rol=Usuario.Rol.EMPRESA).first()
            except Exception:
                company_user = User.objects.filter(rol=Usuario.Rol.EMPRESA).first()
                
            if not company_user:
                return JsonResponse({'error': 'No se encontró una empresa proveedora registrada.'}, status=400)
                
            product = Producto.objects.create(
                empresa=company_user,
                nombre=data.get('name'),
                precio=data.get('pricePerUnit'),
                stock=data.get('stock', 50),
                descripcion=data.get('unitPackName', 'Lote mayorista'),
                umbral_bajo_stock=10
            )
            
            category = get_product_category(product.nombre)
            
            return JsonResponse({
                'id': str(product.id),
                'name': product.nombre,
                'category': category,
                'pricePerUnit': float(product.precio),
                'unitPackName': product.descripcion,
                'stock': product.stock,
                'image': get_product_image(product.nombre, category),
                'companyName': company_name,
                'isLowStock': product.stock <= product.umbral_bajo_stock
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def api_pedidos(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método no permitido'}, status=405)
        
    try:
        data = json.loads(request.body)
        cart = data.get('cart', {})
        client_name = data.get('clientName', 'don_pepe')
        
        # Find client user
        try:
            client_user = User.objects.filter(email__icontains=client_name).first()
            if not client_user:
                client_user = User.objects.filter(rol=Usuario.Rol.TENDERO).first()
        except Exception:
            client_user = User.objects.filter(rol=Usuario.Rol.TENDERO).first()
            
        if not client_user:
            return JsonResponse({'error': 'No se encontró un cliente tendero registrado.'}, status=400)
            
        # Create Pedido and details
        # For simplicity, group products by company
        created_orders = []
        for prod_id, qty in cart.items():
            try:
                product = Producto.objects.get(id=int(prod_id))
            except Producto.DoesNotExist:
                continue
                
            # Deduct stock
            product.stock = max(0, product.stock - qty)
            product.save()
            
            # Simple simulation: one Pedido per product for simplicity or group by company
            # We can create a single Pedido for the company
            monto_total = float(product.precio) * qty
            # Commission calculation: 5%
            monto_comision = monto_total * 0.05
            
            pedido = Pedido.objects.create(
                cliente=client_user,
                empresa=product.empresa,
                vendedor_freelance=User.objects.filter(rol=Usuario.Rol.FREELANCER).first(),
                monto_total=monto_total,
                monto_comision=monto_comision,
                estado=Pedido.EstadoPedido.PAGADO,
                comision_retenida=True,
                entrega_confirmada=False
            )
            
            DetallePedido.objects.create(
                pedido=pedido,
                producto=product,
                cantidad=qty,
                precio_unitario=product.precio
            )
            created_orders.append(pedido.id)
            
        return JsonResponse({'message': 'Pedido realizado con éxito', 'orderIds': created_orders})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def api_min_order(request):
    # Find first company profile
    profile = PerfilEmpresa.objects.first()
    if not profile:
        # Create a default one if it doesn't exist
        company = User.objects.filter(rol=Usuario.Rol.EMPRESA).first()
        if company:
            profile = PerfilEmpresa.objects.create(
                usuario=company,
                nombre_empresa="Distribuidora Mayorista ISBEN",
                monto_minimo_compra=60.00,
                suscripcion_activa=True
            )
            
    if request.method == 'GET':
        min_order = float(profile.monto_minimo_compra) if profile else 60.00
        return JsonResponse({'minOrder': min_order})
        
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            new_min = data.get('minOrder')
            if new_min is not None and profile:
                profile.monto_minimo_compra = new_min
                profile.save()
                return JsonResponse({'minOrder': float(profile.monto_minimo_compra)})
            return JsonResponse({'error': 'Datos inválidos'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
