package com.tienda.dto;

import com.tienda.model.Usuario;
import java.time.LocalDateTime;

/** Lo que la API devuelve tras registrar o iniciar sesión (nunca incluye la contraseña). */
public class UsuarioResponse {
    private Long id;
    private String nombre;
    private String email;
    private String rol;
    private LocalDateTime creado;

    public static UsuarioResponse from(Usuario u) {
        UsuarioResponse r = new UsuarioResponse();
        r.id = u.getId();
        r.nombre = u.getNombre();
        r.email = u.getEmail();
        r.rol = u.getRol();
        r.creado = u.getCreado();
        return r;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public String getRol() { return rol; }
    public LocalDateTime getCreado() { return creado; }
}
