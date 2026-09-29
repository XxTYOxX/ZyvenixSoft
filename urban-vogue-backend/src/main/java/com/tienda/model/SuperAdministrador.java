package com.tienda.model;

import jakarta.persistence.*;

/**
 * Máximo nivel de administración. Hereda de Administrador.
 */
@Entity
@Table(name = "super_administradores")
@PrimaryKeyJoinColumn(name = "id")
public class SuperAdministrador extends Administrador {

    private boolean esSuperUser;
    private String tokenSeguridad;

    protected SuperAdministrador() {
    }

    public SuperAdministrador(String nombre, String email, String password, String codigoEmpleado,
                               Integer nivelAcceso, boolean esSuperUser, String tokenSeguridad) {
        super(nombre, email, password, codigoEmpleado, nivelAcceso);
        this.esSuperUser = esSuperUser;
        this.tokenSeguridad = tokenSeguridad;
    }

    // ---- Getters y setters ----

    public boolean isEsSuperUser() {
        return esSuperUser;
    }

    public void setEsSuperUser(boolean esSuperUser) {
        this.esSuperUser = esSuperUser;
    }

    public String getTokenSeguridad() {
        return tokenSeguridad;
    }

    public void setTokenSeguridad(String tokenSeguridad) {
        this.tokenSeguridad = tokenSeguridad;
    }
}
