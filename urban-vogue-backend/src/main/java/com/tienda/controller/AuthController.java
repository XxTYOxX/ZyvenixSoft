package com.tienda.controller;

import com.tienda.dto.LoginRequest;
import com.tienda.dto.RegistroRequest;
import com.tienda.dto.UsuarioResponse;
import com.tienda.model.Usuario;
import com.tienda.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@Valid @RequestBody RegistroRequest req) {
        try {
            Usuario u = usuarioService.registrar(req);
            return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioResponse.from(u));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        try {
            Usuario u = usuarioService.login(req.getEmail(), req.getPassword());
            return ResponseEntity.ok(UsuarioResponse.from(u));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }
}
