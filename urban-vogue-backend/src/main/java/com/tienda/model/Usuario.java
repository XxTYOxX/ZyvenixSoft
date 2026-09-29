package com.tienda.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Clase base persistente. Igual que en tu diagrama original, Usuario nunca
 * se guarda directamente: siempre a través de UsuarioFinal, Administrador
 * o SuperAdministrador (estrategia de herencia JOINED: cada subtipo tiene
 * su propia tabla, unida por el mismo id).
 */
@Entity
@Table(name = "usuarios")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private LocalDateTime creado = LocalDateTime.now();

    private LocalDateTime ultimoAcceso;

    protected Usuario() {
    }

    protected Usuario(String nombre, String email, String password) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
    }

    /** Valida credenciales (mismo método del diagrama original). */
    public boolean iniciarSesion(String emailIngresado, String passwordIngresado) {
        return this.email.equals(emailIngresado) && this.password.equals(passwordIngresado);
    }

    /** Rol simplificado que usa el frontend: "cliente" o "admin". */
    public abstract String getRol();

    // ---- Getters y setters ----

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDateTime getCreado() {
        return creado;
    }

    public LocalDateTime getUltimoAcceso() {
        return ultimoAcceso;
    }

    public void setUltimoAcceso(LocalDateTime ultimoAcceso) {
        this.ultimoAcceso = ultimoAcceso;
    }
}
