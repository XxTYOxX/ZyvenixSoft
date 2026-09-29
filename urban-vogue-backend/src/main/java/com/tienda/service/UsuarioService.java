package com.tienda.service;

import com.tienda.dto.RegistroRequest;
import com.tienda.model.Usuario;
import com.tienda.model.UsuarioFinal;
import com.tienda.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario registrar(RegistroRequest req) {
        if (usuarioRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Ese correo ya está registrado");
        }
        UsuarioFinal nuevo = new UsuarioFinal(req.getNombre(), req.getEmail(), req.getPassword());
        nuevo.setDireccionEnvio(req.getDireccionEnvio());
        nuevo.setTelefono(req.getTelefono());
        return usuarioRepository.save(nuevo);
    }

    public Usuario login(String email, String password) {
        Usuario u = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Datos incorrectos"));
        if (!u.iniciarSesion(email, password)) {
            throw new IllegalArgumentException("Datos incorrectos");
        }
        u.setUltimoAcceso(LocalDateTime.now());
        return usuarioRepository.save(u);
    }
}
