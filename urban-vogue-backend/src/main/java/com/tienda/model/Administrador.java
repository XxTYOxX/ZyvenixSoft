package com.tienda.model;

import jakarta.persistence.*;

/**
 * Administrador de la tienda. Hereda de Usuario.
 */
@Entity
@Table(name = "administradores")
@PrimaryKeyJoinColumn(name = "id")
public class Administrador extends Usuario {

    private String codigoEmpleado;
    private Integer nivelAcceso;

    protected Administrador() {
    }

    public Administrador(String nombre, String email, String password, String codigoEmpleado, Integer nivelAcceso) {
        super(nombre, email, password);
        this.codigoEmpleado = codigoEmpleado;
        this.nivelAcceso = nivelAcceso;
    }

    @Override
    public String getRol() {
        return "admin";
    }

    // ---- Getters y setters ----

    public String getCodigoEmpleado() {
        return codigoEmpleado;
    }

    public void setCodigoEmpleado(String codigoEmpleado) {
        this.codigoEmpleado = codigoEmpleado;
    }

    public Integer getNivelAcceso() {
        return nivelAcceso;
    }

    public void setNivelAcceso(Integer nivelAcceso) {
        this.nivelAcceso = nivelAcceso;
    }
}
