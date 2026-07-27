from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from .models import Usuario, PerfilEmpresa, PerfilFreelance, Pedido

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
