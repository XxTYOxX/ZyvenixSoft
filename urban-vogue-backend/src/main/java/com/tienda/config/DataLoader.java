package com.tienda.config;

import com.tienda.model.Administrador;
import com.tienda.model.Producto;
import com.tienda.repository.ProductoRepository;
import com.tienda.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Al arrancar el backend por primera vez (base de datos vacía), carga los
 * mismos 24 productos y la misma cuenta de administrador de demostración
 * que ya tenía la tienda, para que el frontend no pierda nada al conectarse.
 */
@Component
public class DataLoader implements CommandLineRunner {

    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    public DataLoader(ProductoRepository productoRepository, UsuarioRepository usuarioRepository) {
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void run(String... args) {
        if (productoRepository.count() == 0) {
            seedProductos();
        }
        if (usuarioRepository.findByEmail("alexander@urbanboguestore.com").isEmpty()) {
            Administrador admin = new Administrador(
                    "Alexander Jiménez", "alexander@urbanboguestore.com", "admin123", "EMP-000", 5);
            usuarioRepository.save(admin);
        }
    }

    private void seedProductos() {
        // El orden y el stock inicial coinciden con los que ya usaba el panel de administrador.
        List<Producto> lista = List.of(
            p("Vestido Beige", 189900, 14, "Mujeres", null, "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=90"),
            p("Chaqueta Urbana", 159900, 9, "Hombres", "Chaquetas", "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=90"),
            p("Pantalón Slim", 149900, 22, "Hombres", "Jeans", "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=90"),
            p("Blusa Casual", 97900, 30, "Mujeres", null, "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=700&q=90"),
            p("Bolso Classic", 119900, 7, "Accesorios", null, "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=90"),
            p("Camisa Clásica", 109900, 18, "Hombres", "Camisas Clásicas", "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=90"),
            p("Conjunto Elegante", 229900, 5, "Mujeres", null, "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=90"),
            p("Gafas Vogue", 89900, 26, "Accesorios", null, "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=90"),
            p("Camisa Oversize Urbana", 99900, 20, "Hombres", "Camisas Oversize", "https://images.unsplash.com/photo-1602107525858-2de7d7cf21b3?auto=format&fit=crop&w=700&q=90"),
            p("Camisa Casual Blanca", 94900, 15, "Hombres", "Camisas", "https://images.unsplash.com/photo-1624181497355-72434fbdf734?auto=format&fit=crop&w=700&q=90"),
            p("Zapatos Urban Sneaker", 219900, 4, "Hombres", "Zapatos", "https://images.unsplash.com/photo-1615743472612-93b21e520fad?auto=format&fit=crop&w=700&q=90"),
            p("Sudadera Oversize Gris", 139900, 12, "Hombres", "Sudaderas", "https://images.unsplash.com/photo-1593979189584-cb269cecc9ad?auto=format&fit=crop&w=700&q=90"),
            p("Camisa Tropical Estampada", 104900, 16, "Hombres", "Camisas", "img/13.jpg"),
            p("Chaqueta Corta Negra", 179900, 8, "Mujeres", null, "img/14.jpg"),
            p("Pantalón Wide Leg", 139900, 19, "Mujeres", null, "img/15.jpg"),
            p("Conjunto Verde Menta", 169900, 11, "Mujeres", null, "img/16.jpg"),
            p("Blazer Rosa Fucsia", 189900, 3, "Mujeres", null, "img/17.jpg"),
            p("Jean Baggy", 149900, 24, "Mujeres", null, "img/18.jpg"),
            p("Pulsera Mariposas", 59900, 28, "Accesorios", null, "img/19.jpg"),
            p("Cadena Plateada", 79900, 21, "Accesorios", null, "img/20.jpg"),
            p("Set Pulseras Trébol", 89900, 6, "Accesorios", null, "img/21.jpg"),
            p("Gorra Rosada", 69900, 17, "Accesorios", null, "img/22.jpg"),
            p("Gorra Gris Vintage", 74900, 13, "Accesorios", null, "img/23.jpg"),
            p("Gorra Negra", 69900, 0, "Accesorios", null, "img/24.jpg")
        );
        productoRepository.saveAll(lista);
    }

    private Producto p(String nombre, double precio, int stock, String categoria, String subcategoria, String img) {
        return new Producto(nombre, precio, stock, categoria, subcategoria, img);
    }
}
