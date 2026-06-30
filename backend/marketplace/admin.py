from django.contrib import admin
from django.db import models
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from django.contrib import messages
from .models import (
    Usuario,
    PerfilEmpresa,
    PerfilFreelance,
    Producto,
    ExamenCertificacion,
    ResultadoExamen,
    Pedido,
    DetallePedido,
    Pago
)

# --- INLINES ---

class DetallePedidoInline(admin.TabularInline):
    model = DetallePedido
    extra = 1
    fields = ('producto', 'cantidad', 'precio_unitario')


class PagoInline(admin.TabularInline):
    model = Pago
    extra = 0
    readonly_fields = ('fecha_pago',)


# --- CUSTOM ADMINS ---

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    # Agregar 'rol' y 'telefono' a los fields del formulario
    fieldsets = UserAdmin.fieldsets + (
        ('Información de Rol y Contacto', {'fields': ('rol', 'telefono')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Información de Rol y Contacto', {'fields': ('rol', 'telefono')}),
    )
    
    list_display = ('username', 'email', 'first_name', 'last_name', 'rol', 'is_staff')
    list_filter = ('rol', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'telefono')
    ordering = ('username',)


@admin.register(PerfilEmpresa)
class PerfilEmpresaAdmin(admin.ModelAdmin):
    list_display = ('nombre_empresa', 'usuario', 'monto_minimo_compra', 'suscripcion_activa', 'mostrar_logo')
    list_filter = ('suscripcion_activa',)
    search_fields = ('nombre_empresa', 'usuario__username', 'usuario__email')
    readonly_fields = ('mostrar_logo',)

    def mostrar_logo(self, obj):
        if obj.logo:
            return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: contain; border-radius: 4px;" />', obj.logo.url)
        return "Sin Logo"
    mostrar_logo.short_description = "Logo"


@admin.register(PerfilFreelance)
class PerfilFreelanceAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'esta_calificado')
    list_filter = ('esta_calificado',)
    search_fields = ('usuario__username', 'usuario__email')


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'empresa', 'precio', 'stock', 'umbral_bajo_stock', 'alerta_stock', 'mostrar_vista_previa')
    list_filter = ('empresa', 'stock')
    search_fields = ('nombre', 'descripcion', 'empresa__username')
    readonly_fields = ('mostrar_vista_previa',)

    def mostrar_vista_previa(self, obj):
        if obj.vista_previa:
            return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />', obj.vista_previa.url)
        return "Sin Vista Previa"
    mostrar_vista_previa.short_description = "Vista Previa"
    
    def alerta_stock(self, obj):
        if obj.stock_bajo:
            return format_html(
                '<span style="color: #d9534f; font-weight: bold; background-color: #f2dede; padding: 2px 5px; border-radius: 3px;">⚠️ Stock Bajo ({})</span>',
                obj.stock
            )
        return format_html(
            '<span style="color: #5cb85c; font-weight: bold; background-color: #dff0d8; padding: 2px 5px; border-radius: 3px;">Ok ({})</span>',
            obj.stock
        )
    alerta_stock.short_description = 'Estado Stock'

    actions = ['reabastecer_stock_rapido']

    @admin.action(description="Reabastecer stock (+50 unidades)")
    def reabastecer_stock_rapido(self, request, queryset):
        updated = queryset.update(stock=models.F('stock') + 50)
        self.message_user(request, f"Se han reabastecido {updated} productos con +50 unidades.", messages.SUCCESS)


@admin.register(ExamenCertificacion)
class ExamenCertificacionAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'empresa')
    list_filter = ('empresa',)
    search_fields = ('titulo', 'descripcion', 'empresa__username')


@admin.register(ResultadoExamen)
class ResultadoExamenAdmin(admin.ModelAdmin):
    list_display = ('freelancer', 'examen', 'aprobado', 'fecha_presentacion')
    list_filter = ('aprobado', 'examen', 'fecha_presentacion')
    search_fields = ('freelancer__username', 'examen__titulo')


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'cliente', 'empresa', 'vendedor_freelance', 
        'monto_total', 'estado', 'entrega_confirmada', 'comision_retenida'
    )
    list_filter = ('estado', 'entrega_confirmada', 'comision_retenida', 'empresa', 'fecha_creacion')
    search_fields = ('id', 'cliente__username', 'vendedor_freelance__username', 'empresa__username')
    inlines = [DetallePedidoInline, PagoInline]
    
    actions = ['confirmar_entrega_y_liberar_comision', 'marcar_despachado']

    @admin.action(description="Confirmar entrega de pedido y liberar comisión")
    def confirmar_entrega_y_liberar_comision(self, request, queryset):
        # Actualizamos estado, entrega_confirmada y comision_retenida
        updated = queryset.update(
            estado=Pedido.EstadoPedido.ENTREGADO,
            entrega_confirmada=True,
            comision_retenida=False
        )
        self.message_user(
            request, 
            f"Se han entregado {updated} pedidos y se han liberado sus respectivas comisiones a los freelancers.", 
            messages.SUCCESS
        )

    @admin.action(description="Marcar pedidos seleccionados como Despachados")
    def marcar_despachado(self, request, queryset):
        updated = queryset.update(estado=Pedido.EstadoPedido.DESPACHADO)
        self.message_user(request, f"Se han marcado {updated} pedidos como Despachados.", messages.SUCCESS)


@admin.register(Pago)
class PagoAdmin(admin.ModelAdmin):
    list_display = ('pedido', 'monto_pagado', 'porcentaje_cobrado', 'pasarela_id', 'fecha_pago')
    list_filter = ('porcentaje_cobrado', 'fecha_pago')
    search_fields = ('pedido__id', 'pasarela_id')
