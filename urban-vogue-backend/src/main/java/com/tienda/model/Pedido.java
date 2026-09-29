package com.tienda.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/** Pedido generado desde el checkout de la tienda. */
@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numero;

    @Column(nullable = false)
    private LocalDateTime fecha = LocalDateTime.now();

    @Column(nullable = false)
    private double total;

    private String metodoPago;

    @Column(nullable = false)
    private String estado = "En proceso";

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @JsonIgnore
    private UsuarioFinal usuario;

    private String nombreEnvio;
    private String direccionEnvio;
    private String ciudadEnvio;
    private String zipEnvio;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PedidoItem> items = new ArrayList<>();

    public void addItem(PedidoItem item) {
        item.setPedido(this);
        this.items.add(item);
    }

    // ---- Getters y setters ----

    public Long getId() {
        return id;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public UsuarioFinal getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioFinal usuario) {
        this.usuario = usuario;
    }

    public String getNombreEnvio() {
        return nombreEnvio;
    }

    public void setNombreEnvio(String nombreEnvio) {
        this.nombreEnvio = nombreEnvio;
    }

    public String getDireccionEnvio() {
        return direccionEnvio;
    }

    public void setDireccionEnvio(String direccionEnvio) {
        this.direccionEnvio = direccionEnvio;
    }

    public String getCiudadEnvio() {
        return ciudadEnvio;
    }

    public void setCiudadEnvio(String ciudadEnvio) {
        this.ciudadEnvio = ciudadEnvio;
    }

    public String getZipEnvio() {
        return zipEnvio;
    }

    public void setZipEnvio(String zipEnvio) {
        this.zipEnvio = zipEnvio;
    }

    public List<PedidoItem> getItems() {
        return items;
    }
}
