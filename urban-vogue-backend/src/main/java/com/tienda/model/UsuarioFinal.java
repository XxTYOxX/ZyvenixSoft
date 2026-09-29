package com.tienda.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Cliente de la tienda. Hereda de Usuario.
 * Relación: 1 UsuarioFinal --- 0..* Pedido.
 */
@Entity
@Table(name = "usuarios_finales")
@PrimaryKeyJoinColumn(name = "id")
public class UsuarioFinal extends Usuario {

    private String direccionEnvio;
    private String telefono;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private List<Pedido> pedidos = new ArrayList<>();

    protected UsuarioFinal() {
    }

    public UsuarioFinal(String nombre, String email, String password) {
        super(nombre, email, password);
    }

    @Override
    public String getRol() {
        return "cliente";
    }

    // ---- Getters y setters ----

    public String getDireccionEnvio() {
        return direccionEnvio;
    }

    public void setDireccionEnvio(String direccionEnvio) {
        this.direccionEnvio = direccionEnvio;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public List<Pedido> getPedidos() {
        return pedidos;
    }
}
