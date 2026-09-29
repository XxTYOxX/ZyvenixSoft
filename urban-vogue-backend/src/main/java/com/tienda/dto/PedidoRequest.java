package com.tienda.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class PedidoRequest {
    /** Opcional: si el cliente inició sesión, se asocia el pedido a su cuenta. */
    private String usuarioEmail;
    @NotEmpty
    private List<PedidoItemRequest> items;
    private String metodoPago;
    private String nombreEnvio;
    private String direccionEnvio;
    private String ciudadEnvio;
    private String zipEnvio;

    public String getUsuarioEmail() { return usuarioEmail; }
    public void setUsuarioEmail(String usuarioEmail) { this.usuarioEmail = usuarioEmail; }
    public List<PedidoItemRequest> getItems() { return items; }
    public void setItems(List<PedidoItemRequest> items) { this.items = items; }
    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
    public String getNombreEnvio() { return nombreEnvio; }
    public void setNombreEnvio(String nombreEnvio) { this.nombreEnvio = nombreEnvio; }
    public String getDireccionEnvio() { return direccionEnvio; }
    public void setDireccionEnvio(String direccionEnvio) { this.direccionEnvio = direccionEnvio; }
    public String getCiudadEnvio() { return ciudadEnvio; }
    public void setCiudadEnvio(String ciudadEnvio) { this.ciudadEnvio = ciudadEnvio; }
    public String getZipEnvio() { return zipEnvio; }
    public void setZipEnvio(String zipEnvio) { this.zipEnvio = zipEnvio; }
}
