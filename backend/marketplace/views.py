from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.db import transaction
from .models import Usuario, PerfilEmpresa, PerfilFreelance, Producto, Pedido, DetallePedido, TokenSesion
from django.db.models import Q
import json
import functools

User = get_user_model()


def requiere_token(view_func):
    """Decorador que protege un endpoint exigiendo el header 'Authorization: Token <token>'.
    Rechaza con 401 si el token es invalido, no existe, o ha expirado (> 24h).
    """
    @functools.wraps(view_func)
    def wrapper(request, *args, **kwargs):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('Token '):
            return render(request, '401.html', status=401)
        token_value = auth_header.split(' ', 1)[1].strip()
        try:
            from django.utils import timezone
            token_obj = TokenSesion.objects.select_related('usuario').get(token=token_value)
            # Verificar que el token no haya expirado
            if not token_obj.esta_vigente():
                token_obj.delete()  # Eliminar token vencido de la BD
                return render(request, '401.html', status=401)
            request.user_token = token_obj.usuario
        except (TokenSesion.DoesNotExist, Exception):
            return render(request, '401.html', status=401)
        return view_func(request, *args, **kwargs)
    return wrapper


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
        
        # Generar (o reutilizar) token de sesion para este usuario
        token_obj, _ = TokenSesion.objects.get_or_create(usuario=user)
            
        return JsonResponse({
            'username': user.username,
            'email': user.email,
            'rol': user.rol.lower(),  # Convert to lowercase to match frontend "tendero", "empresa", etc.
            'name': name,
            'token': str(token_obj.token)
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@requiere_token
def api_productos(request):
    if request.method == 'GET':
        # Seeding logic: if no products exist, seed the default ones
        if Producto.objects.count() == 0:
            # Find or create a default company user to associate with
            company_user = User.objects.filter(rol=Usuario.Rol.EMPRESA).first()
            if not company_user:
                company_user = User.objects.create_user(
                    username="empresa_default",
                    email="proveedor@isben.com",
                    rol=Usuario.Rol.EMPRESA
                )
                company_user.set_password("proveedor123")
                company_user.save()
                PerfilEmpresa.objects.create(
                    usuario=company_user,
                    nombre_empresa="Distribuidora Mayorista ISBEN",
                    monto_minimo_compra=60.00,
                    suscripcion_activa=True
                )
            
            # Create default products
            Producto.objects.create(
                empresa=company_user,
                nombre="Aceite Vegetal D'Oliva 1L",
                precio=34.50,
                stock=85,
                descripcion="Paca de 12 botellas (1L c/u)",
                umbral_bajo_stock=10
            )
            Producto.objects.create(
                empresa=company_user,
                nombre="Arroz Grano Largo Superior",
                precio=28.00,
                stock=12,
                descripcion="Saco de 50 kg",
                umbral_bajo_stock=10
            )
            Producto.objects.create(
                empresa=company_user,
                nombre="Pack Jugos Frutales Surtidos",
                precio=18.50,
                stock=150,
                descripcion="Paca termoencogible x 24 unidades",
                umbral_bajo_stock=10
            )
            Producto.objects.create(
                empresa=company_user,
                nombre="Agua Mineral Natural 500ml",
                precio=12.00,
                stock=50,
                descripcion="Paca x 24 botellas",
                umbral_bajo_stock=10
            )

        products_list = []
        for p in Producto.objects.all().select_related('empresa__perfil_empresa'):
            # Determine company name
            try:
                co_name = p.empresa.perfil_empresa.nombre_empresa
            except Exception:
                co_name = "Distribuidora Mayorista ISBEN"
                
            desc = p.descripcion if p.descripcion else "Lote / Paca mayorista"
            custom_image = None
            if "||" in desc:
                parts = desc.split("||")
                desc = parts[0].strip()
                custom_image = parts[1].strip()

            category = get_product_category(p.nombre)
            image_url = custom_image if custom_image else (p.vista_previa.url if p.vista_previa else get_product_image(p.nombre, category))
            
            products_list.append({
                'id': str(p.id),
                'name': p.nombre,
                'category': category,
                'pricePerUnit': float(p.precio),
                'unitPackName': desc,
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
                
            desc = data.get('unitPackName', 'Lote mayorista')
            image_input = data.get('image', '')
            # If custom image is provided, append it to the description
            if image_input and not image_input.startswith('/groceries_pack') and not image_input.startswith('/beverages_pack') and not image_input.startswith('/cleaning_pack'):
                desc = f"{desc} || {image_input}"

            product = Producto.objects.create(
                empresa=company_user,
                nombre=data.get('name'),
                precio=data.get('pricePerUnit'),
                stock=data.get('stock', 50),
                descripcion=desc,
                umbral_bajo_stock=10
            )
            
            category = get_product_category(product.nombre)
            image_url = image_input if image_input else get_product_image(product.nombre, category)
            
            return JsonResponse({
                'id': str(product.id),
                'name': product.nombre,
                'category': category,
                'pricePerUnit': float(product.precio),
                'unitPackName': data.get('unitPackName', 'Lote mayorista'),
                'stock': product.stock,
                'image': image_url,
                'companyName': company_name,
                'isLowStock': product.stock <= product.umbral_bajo_stock
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            prod_id = data.get('id')
            product = Producto.objects.get(id=int(prod_id))
            product.nombre = data.get('name', product.nombre)
            product.precio = data.get('pricePerUnit', product.precio)
            product.stock = data.get('stock', product.stock)
            
            desc = data.get('unitPackName', product.descripcion)
            image_input = data.get('image', '')
            if image_input and not image_input.startswith('/groceries_pack') and not image_input.startswith('/beverages_pack') and not image_input.startswith('/cleaning_pack'):
                clean_desc = desc.split("||")[0].strip()
                desc = f"{clean_desc} || {image_input}"
            else:
                desc = desc.split("||")[0].strip()

            product.descripcion = desc
            product.save()
            
            category = get_product_category(product.nombre)
            image_url = image_input if image_input else get_product_image(product.nombre, category)
            
            return JsonResponse({
                'id': str(product.id),
                'name': product.nombre,
                'category': category,
                'pricePerUnit': float(product.precio),
                'unitPackName': data.get('unitPackName', desc.split("||")[0].strip()),
                'stock': product.stock,
                'image': image_url,
                'isLowStock': product.stock <= product.umbral_bajo_stock
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    elif request.method == 'DELETE':
        prod_id = request.GET.get('id')
        if not prod_id:
            try:
                data = json.loads(request.body)
                prod_id = data.get('id')
            except Exception:
                pass
        if prod_id:
            try:
                Producto.objects.filter(id=int(prod_id)).delete()
                return JsonResponse({'message': 'Producto eliminado con éxito'})
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=400)
        return JsonResponse({'error': 'ID de producto no proporcionado'}, status=400)

@csrf_exempt
@requiere_token
def api_pedidos(request):
    if request.method == 'GET':
        client_name = request.GET.get('clientName', '').strip()
        orders_list = []
        orders = Pedido.objects.all().select_related('cliente')
        if client_name:
            # We map demo name to actual user if it matches Pepe
            if "pepe" in client_name.lower():
                orders = orders.filter(Q(cliente__username__icontains="don_pepe") | Q(cliente__email__icontains="don_pepe") | Q(cliente__username__icontains=client_name))
            else:
                orders = orders.filter(Q(cliente__username__icontains=client_name) | Q(cliente__email__icontains=client_name))
                
        for o in orders.order_by('-fecha_creacion'):
            orders_list.append({
                'id': f"#{1000 + o.id}",
                'date': o.fecha_creacion.strftime('%d/%m/%Y'),
                'status': 'Pagado' if o.estado == Pedido.EstadoPedido.PAGADO else ('Entregado' if o.estado == Pedido.EstadoPedido.ENTREGADO else o.get_estado_display()),
                'total': float(o.monto_total)
            })
        return JsonResponse(orders_list, safe=False)

    elif request.method != 'POST':
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
            clean_id = prod_id
            if isinstance(prod_id, str) and '-' in prod_id:
                clean_id = prod_id.split('-')[-1]
            try:
                # Transaccion atomica con lock de fila para evitar race conditions en stock
                with transaction.atomic():
                    product = Producto.objects.select_for_update().get(id=int(clean_id))
                    if product.stock < qty:
                        continue  # Saltar si no hay stock suficiente
                    product.stock = max(0, product.stock - qty)
                    product.save()
            except (Producto.DoesNotExist, ValueError):
                continue
            
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
@requiere_token
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

@csrf_exempt
@requiere_token
def api_tests(request):
    if request.method == 'GET':
        # Seeding default tests if none exist
        if ExamenCertificacion.objects.count() == 0:
            company_user = User.objects.filter(rol=Usuario.Rol.EMPRESA).first()
            if company_user:
                ExamenCertificacion.objects.create(
                    empresa=company_user,
                    titulo="Certificación Manejo de Cadena de Frío",
                    descripcion="Evaluación sobre refrigeración y conservación de lácteos y vacunas."
                )
                ExamenCertificacion.objects.create(
                    empresa=company_user,
                    titulo="Test de Conocimiento de Productos Farmacéuticos",
                    descripcion="Evaluación obligatoria para la distribución de medicamentos."
                )

        freelancer_name = request.GET.get('freelancer', '').strip()
        freelancer_user = None
        if freelancer_name:
            freelancer_user = User.objects.filter(username__icontains=freelancer_name, rol=Usuario.Rol.FREELANCER).first()
            if not freelancer_user:
                freelancer_user = User.objects.filter(rol=Usuario.Rol.FREELANCER).first()

        tests_list = []
        for exam in ExamenCertificacion.objects.all().select_related('empresa__perfil_empresa'):
            try:
                co_name = exam.empresa.perfil_empresa.nombre_empresa
            except Exception:
                co_name = "Proveedor General"

            # Check if this freelancer has passed
            status = "Pendiente"
            if freelancer_user:
                result = ResultadoExamen.objects.filter(freelancer=freelancer_user, examen=exam).first()
                if result and result.aprobado:
                    status = "Aprobado"

            tests_list.append({
                'id': exam.id,
                'title': exam.titulo,
                'company': co_name,
                'status': status
            })
        return JsonResponse(tests_list, safe=False)

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Find the company user
            company_name = data.get('company', 'Distribuidora Mayorista ISBEN')
            try:
                profile = PerfilEmpresa.objects.filter(nombre_empresa__icontains=company_name).first()
                company_user = profile.usuario if profile else User.objects.filter(rol=Usuario.Rol.EMPRESA).first()
            except Exception:
                company_user = User.objects.filter(rol=Usuario.Rol.EMPRESA).first()

            if not company_user:
                return JsonResponse({'error': 'No se encontró una empresa registrada.'}, status=400)

            exam = ExamenCertificacion.objects.create(
                empresa=company_user,
                titulo=data.get('title'),
                descripcion=data.get('description', '')
            )
            return JsonResponse({
                'id': exam.id,
                'title': exam.titulo,
                'company': company_name,
                'status': 'Pendiente'
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            test_id = data.get('id')
            exam = ExamenCertificacion.objects.get(id=int(test_id))
            exam.titulo = data.get('title', exam.titulo)
            exam.save()
            return JsonResponse({
                'id': exam.id,
                'title': exam.titulo,
                'company': exam.empresa.perfil_empresa.nombre_empresa if exam.empresa.perfil_empresa else "Proveedor",
                'status': 'Pendiente'
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    elif request.method == 'DELETE':
        test_id = request.GET.get('id')
        if not test_id:
            try:
                data = json.loads(request.body)
                test_id = data.get('id')
            except Exception:
                pass
        if test_id:
            try:
                ExamenCertificacion.objects.filter(id=int(test_id)).delete()
                return JsonResponse({'message': 'Examen eliminado con éxito'})
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=400)
        return JsonResponse({'error': 'ID de examen no proporcionado'}, status=400)

@csrf_exempt
@requiere_token
def api_take_test(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    try:
        data = json.loads(request.body)
        test_id = data.get('testId')
        freelancer_name = data.get('freelancer', '').strip()
        aprobado = data.get('aprobado', False)

        freelancer_user = User.objects.filter(username__icontains=freelancer_name, rol=Usuario.Rol.FREELANCER).first()
        if not freelancer_user:
            freelancer_user = User.objects.filter(rol=Usuario.Rol.FREELANCER).first()

        if not freelancer_user:
            return JsonResponse({'error': 'Freelancer no encontrado'}, status=400)

        exam = ExamenCertificacion.objects.get(id=int(test_id))
        
        # Save or update result
        result, created = ResultadoExamen.objects.update_or_create(
            freelancer=freelancer_user,
            examen=exam,
            defaults={'aprobado': aprobado}
        )

        return JsonResponse({'message': 'Resultado registrado con éxito', 'aprobado': result.aprobado})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
@requiere_token
def api_logout(request):
    """Invalida el token de sesion del usuario cerrando su sesion activa.
    Elimina el token de la BD para que no pueda reutilizarse.
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Metodo no permitido'}, status=405)
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    if auth_header.startswith('Token '):
        token_value = auth_header.split(' ', 1)[1].strip()
        deleted_count, _ = TokenSesion.objects.filter(token=token_value).delete()
        if deleted_count > 0:
            return JsonResponse({'message': 'Sesion cerrada con exito. Token invalidado.'})
    return JsonResponse({'message': 'Sesion cerrada.'})
