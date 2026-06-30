from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

class Usuario(AbstractUser):
    class Rol(models.TextChoices):
        ADMIN = 'ADMIN', 'Administrador de Plataforma'
        EMPRESA = 'EMPRESA', 'Empresa (Proveedor)'
        FREELANCER = 'FREELANCER', 'Vendedor Freelance'
        TENDERO = 'TENDERO', 'Tendero (Cliente)'

    rol = models.CharField(
        max_length=20,
        choices=Rol.choices,
        default=Rol.TENDERO,
        verbose_name="Rol de Usuario"
    )
    telefono = models.CharField(max_length=20, blank=True, null=True, verbose_name="Teléfono")

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"

    def __str__(self):
        return f"{self.username} ({self.get_rol_display()})"


class PerfilEmpresa(models.Model):
    usuario = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        related_name='perfil_empresa',
        limit_choices_to={'rol': Usuario.Rol.EMPRESA},
        verbose_name="Usuario Empresa"
    )
    nombre_empresa = models.CharField(max_length=150, verbose_name="Nombre de la Empresa")
    monto_minimo_compra = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        verbose_name="Monto Mínimo de Compra"
    )
    suscripcion_activa = models.BooleanField(default=False, verbose_name="Suscripción Activa")
    logo = models.ImageField(upload_to='empresa/logos/', blank=True, null=True, verbose_name="Logo de la Empresa")

    class Meta:
        verbose_name = "Perfil de Empresa"
        verbose_name_plural = "Perfiles de Empresas"

    def __str__(self):
        return self.nombre_empresa


class PerfilFreelance(models.Model):
    usuario = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        related_name='perfil_freelance',
        limit_choices_to={'rol': Usuario.Rol.FREELANCER},
        verbose_name="Usuario Freelance"
    )
    esta_calificado = models.BooleanField(
        default=False,
        verbose_name="Está Calificado/Certificado"
    )

    class Meta:
        verbose_name = "Perfil de Freelance"
        verbose_name_plural = "Perfiles de Freelancers"

    def __str__(self):
        status = "Calificado" if self.esta_calificado else "General"
        return f"Freelancer: {self.usuario.username} ({status})"


class Producto(models.Model):
    empresa = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='productos',
        limit_choices_to={'rol': Usuario.Rol.EMPRESA},
        verbose_name="Empresa Proveedora"
    )
    nombre = models.CharField(max_length=255, verbose_name="Nombre del Producto")
    descripcion = models.TextField(blank=True, null=True, verbose_name="Descripción")
    precio = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio Mayorista")
    stock = models.IntegerField(default=0, verbose_name="Stock Disponible")
    umbral_bajo_stock = models.IntegerField(default=10, verbose_name="Umbral de Stock Bajo")
    vista_previa = models.ImageField(upload_to='producto/previews/', blank=True, null=True, verbose_name="Vista Previa / Imagen")

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"

    def __str__(self):
        return f"{self.nombre} - Stock: {self.stock}"

    @property
    def stock_bajo(self):
        return self.stock <= self.umbral_bajo_stock


class ExamenCertificacion(models.Model):
    empresa = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='examenes',
        limit_choices_to={'rol': Usuario.Rol.EMPRESA},
        verbose_name="Empresa Creadora"
    )
    titulo = models.CharField(max_length=255, verbose_name="Título del Examen")
    descripcion = models.TextField(blank=True, null=True, verbose_name="Descripción del Examen/Curso")

    class Meta:
        verbose_name = "Examen de Certificación"
        verbose_name_plural = "Exámenes de Certificación"

    def __str__(self):
        return f"{self.titulo} (por {self.empresa.username})"


class ResultadoExamen(models.Model):
    freelancer = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='resultados_examenes',
        limit_choices_to={'rol': Usuario.Rol.FREELANCER},
        verbose_name="Vendedor Freelance"
    )
    examen = models.ForeignKey(
        ExamenCertificacion,
        on_delete=models.CASCADE,
        related_name='resultados',
        verbose_name="Examen Rendido"
    )
    aprobado = models.BooleanField(default=False, verbose_name="Aprobado")
    fecha_presentacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Presentación")

    class Meta:
        verbose_name = "Resultado de Examen"
        verbose_name_plural = "Resultados de Exámenes"
        unique_together = ('freelancer', 'examen')

    def __str__(self):
        estado = "Aprobado" if self.aprobado else "Reprobado"
        return f"{self.freelancer.username} - {self.examen.titulo}: {estado}"


class Pedido(models.Model):
    class EstadoPedido(models.TextChoices):
        PENDIENTE = 'PENDIENTE', 'Pendiente de Pago'
        PAGADO = 'PAGADO', 'Pagado (Por Despachar)'
        DESPACHADO = 'DESPACHADO', 'Despachado'
        ENTREGADO = 'ENTREGADO', 'Entregado al Cliente'
        CANCELADO = 'CANCELADO', 'Cancelado'

    cliente = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='pedidos_cliente',
        limit_choices_to={'rol': Usuario.Rol.TENDERO},
        verbose_name="Tendero (Cliente)"
    )
    vendedor_freelance = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='pedidos_freelance',
        limit_choices_to={'rol': Usuario.Rol.FREELANCER},
        verbose_name="Vendedor Freelance (Opcional)"
    )
    empresa = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='pedidos_empresa',
        limit_choices_to={'rol': Usuario.Rol.EMPRESA},
        verbose_name="Empresa Proveedora"
    )
    estado = models.CharField(
        max_length=20,
        choices=EstadoPedido.choices,
        default=EstadoPedido.PENDIENTE,
        verbose_name="Estado de Pedido"
    )
    monto_total = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Monto Total")
    monto_comision = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Comisión del Freelance")
    comision_retenida = models.BooleanField(default=True, verbose_name="Comisión Retenida")
    entrega_confirmada = models.BooleanField(default=False, verbose_name="Entrega Confirmada")
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Creación")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Última Actualización")

    class Meta:
        verbose_name = "Pedido"
        verbose_name_plural = "Pedidos"

    def clean(self):
        super().clean()
        # Validación de monto mínimo si hay un perfil de empresa configurado
        try:
            perfil = self.empresa.perfil_empresa
            if self.monto_total < perfil.monto_minimo_compra:
                raise ValidationError({
                    'monto_total': f"El monto total del pedido (${self.monto_total}) es menor al monto mínimo de compra establecido por la empresa (${perfil.monto_minimo_compra})."
                })
        except PerfilEmpresa.DoesNotExist:
            pass

    def __str__(self):
        return f"Pedido #{self.id} - Cliente: {self.cliente.username} - Total: ${self.monto_total}"


class DetallePedido(models.Model):
    pedido = models.ForeignKey(
        Pedido,
        on_delete=models.CASCADE,
        related_name='detalles',
        verbose_name="Pedido"
    )
    producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE,
        verbose_name="Producto"
    )
    cantidad = models.PositiveIntegerField(default=1, verbose_name="Cantidad")
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio Unitario")

    class Meta:
        verbose_name = "Detalle de Pedido"
        verbose_name_plural = "Detalles de Pedidos"

    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre}"


class Pago(models.Model):
    pedido = models.ForeignKey(
        Pedido,
        on_delete=models.CASCADE,
        related_name='pagos',
        verbose_name="Pedido"
    )
    monto_pagado = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Monto Pagado")
    pasarela_id = models.CharField(max_length=255, blank=True, null=True, verbose_name="ID Transacción Pasarela")
    fecha_pago = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Pago")
    porcentaje_cobrado = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Porcentaje cobrado (ej: 50.00 o 100.00)",
        verbose_name="Porcentaje Cobrado"
    )

    class Meta:
        verbose_name = "Registro de Pago"
        verbose_name_plural = "Registros de Pagos"

    def __str__(self):
        return f"Pago de ${self.monto_pagado} para Pedido #{self.pedido.id}"
