from django.test import TestCase, Client
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from .models import Usuario, PerfilEmpresa, PerfilFreelance, Pedido, Producto, TokenSesion
import json

User = get_user_model()


class ISBENTestCase(TestCase):
    def setUp(self):
        # 1. Crear usuarios de prueba para cada rol
        self.admin = User.objects.create_user(
            username='admin_test',
            email='admin@test.com',
            password='testpassword123',
            rol=Usuario.Rol.ADMIN
        )
        
        self.empresa = User.objects.create_user(
            username='empresa_test',
            email='proveedor@test.com',
            password='testpassword123',
            rol=Usuario.Rol.EMPRESA
        )
        
        self.freelancer = User.objects.create_user(
            username='freelance_test',
            email='freelancer@test.com',
            password='testpassword123',
            rol=Usuario.Rol.FREELANCER
        )
        
        self.tendero = User.objects.create_user(
            username='tendero_test',
            email='tendero@test.com',
            password='testpassword123',
            rol=Usuario.Rol.TENDERO
        )

        # 2. Configurar perfiles para Empresa y Freelancer
        self.perfil_empresa = PerfilEmpresa.objects.create(
            usuario=self.empresa,
            nombre_empresa='Fábrica de Prueba S.A.',
            monto_minimo_compra=60.00,
            suscripcion_activa=True
        )

        self.perfil_freelance = PerfilFreelance.objects.create(
            usuario=self.freelancer,
            esta_calificado=True
        )

        # 3. Crear un token valido para usar en tests de endpoints protegidos
        self.token_tendero = TokenSesion.objects.create(usuario=self.tendero)
        self.token_empresa = TokenSesion.objects.create(usuario=self.empresa)

        # 4. Cliente HTTP para tests de endpoints
        self.client = Client()

    # ── Tests de Modelo ──────────────────────────────────────────────────────

    def test_roles_usuario(self):
        """Verifica que los usuarios se creen con el rol e información correctos."""
        self.assertEqual(self.admin.rol, Usuario.Rol.ADMIN)
        self.assertEqual(self.empresa.rol, Usuario.Rol.EMPRESA)
        self.assertEqual(self.freelancer.rol, Usuario.Rol.FREELANCER)
        self.assertEqual(self.tendero.rol, Usuario.Rol.TENDERO)
        
        # Verificar perfiles asociados
        self.assertEqual(self.empresa.perfil_empresa.nombre_empresa, 'Fábrica de Prueba S.A.')
        self.assertTrue(self.freelancer.perfil_freelance.esta_calificado)

    def test_pedido_monto_minimo_compra(self):
        """Verifica que no se permita crear pedidos menores al monto mínimo de la empresa."""
        # Intento de pedido inválido (monto $45.00, mínimo es $60.00)
        pedido_invalido = Pedido(
            cliente=self.tendero,
            empresa=self.empresa,
            vendedor_freelance=self.freelancer,
            monto_total=45.00,
            estado=Pedido.EstadoPedido.PENDIENTE
        )
        
        # Debe lanzar un ValidationError al ejecutar clean()
        with self.assertRaises(ValidationError):
            pedido_invalido.full_clean()

        # Intento de pedido válido (monto $70.00, mínimo es $60.00)
        pedido_valido = Pedido(
            cliente=self.tendero,
            empresa=self.empresa,
            vendedor_freelance=self.freelancer,
            monto_total=70.00,
            estado=Pedido.EstadoPedido.PENDIENTE
        )
        
        # No debe lanzar ninguna excepción
        try:
            pedido_valido.full_clean()
        except ValidationError:
            self.fail("full_clean() lanzó ValidationError para un monto válido.")

    # ── Tests de Endpoints HTTP ───────────────────────────────────────────────

    def test_login_correcto(self):
        """POST /api/login/ con credenciales válidas debe retornar token y datos de usuario."""
        response = self.client.post(
            '/api/login/',
            data=json.dumps({'email': 'tendero@test.com', 'password': 'testpassword123'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('token', data)
        self.assertEqual(data['rol'], 'tendero')
        self.assertIn('username', data)

    def test_login_password_incorrecta(self):
        """POST /api/login/ con contraseña incorrecta debe retornar HTTP 400."""
        response = self.client.post(
            '/api/login/',
            data=json.dumps({'email': 'tendero@test.com', 'password': 'clave_erronea'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertIn('error', data)

    def test_login_email_no_registrado(self):
        """POST /api/login/ con email inexistente debe retornar HTTP 400."""
        response = self.client.post(
            '/api/login/',
            data=json.dumps({'email': 'noexiste@test.com', 'password': 'cualquiera'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)

    def test_productos_sin_token_retorna_401(self):
        """GET /api/productos/ sin header Authorization debe retornar HTTP 401."""
        response = self.client.get('/api/productos/')
        self.assertEqual(response.status_code, 401)

    def test_productos_con_token_invalido_retorna_401(self):
        """GET /api/productos/ con token falso debe retornar HTTP 401."""
        response = self.client.get(
            '/api/productos/',
            HTTP_AUTHORIZATION='Token token-invalido-uuid'
        )
        self.assertEqual(response.status_code, 401)

    def test_productos_con_token_valido_retorna_200(self):
        """GET /api/productos/ con token válido debe retornar HTTP 200 con lista."""
        # Crear un producto de prueba
        Producto.objects.create(
            empresa=self.empresa,
            nombre='Arroz Prueba',
            descripcion='Test producto',
            precio=25.00,
            stock=50
        )
        response = self.client.get(
            '/api/productos/',
            HTTP_AUTHORIZATION=f'Token {self.token_tendero.token}'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)

    def test_pedidos_sin_token_retorna_401(self):
        """GET /api/pedidos/ sin Authorization debe retornar HTTP 401."""
        response = self.client.get('/api/pedidos/')
        self.assertEqual(response.status_code, 401)

    def test_tests_sin_token_retorna_401(self):
        """GET /api/tests/ sin Authorization debe retornar HTTP 401."""
        response = self.client.get('/api/tests/')
        self.assertEqual(response.status_code, 401)

    def test_token_de_sesion_es_unico_por_usuario(self):
        """get_or_create de TokenSesion no debe generar duplicados para el mismo usuario."""
        token1, created1 = TokenSesion.objects.get_or_create(usuario=self.admin)
        token2, created2 = TokenSesion.objects.get_or_create(usuario=self.admin)
        self.assertEqual(token1.token, token2.token)
        self.assertFalse(created2)  # La segunda vez no debe crear uno nuevo
