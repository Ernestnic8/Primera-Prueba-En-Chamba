import {
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Fab,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import { obtenerProductos } from "../../../api/ecommerce/productosApi";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import propTypes from "prop-types";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";

const ComprarProducto = ({ usuario }) => {
  const [data, setData] = useState([]);
  const doc = new jsPDF({ format: "letter" });
  const [numFactura, setNumFactura] = useState(0);
  const [contar, setContar] = useState(0);
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);

  const handleNumFactura = () => {
    setNumFactura(Math.floor(Math.random() * 100000));
  };

  const handleCarga = () => {
    obtenerProductos().then((res) => {
      setData(res.data.response);
    });
  };

  useEffect(() => {
    handleCarga();
  }, []);

  const handlePDF = () => {
    doc.setFontSize(15);
    doc.text("Factura", 100, 25);
    doc.setFontSize(12);
    doc.text(
      `Numero de factura: 
             ${numFactura}`,
      160,
      10
    );
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 160, 30);
    doc.text(`Cliente: ${usuario[0].nombre}`, 15, 45);
    doc.addImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkNvExoAaAOrIviLs7Je6My2vBwCb1a07JwA&s",
      10,
      5,
      45,
      30
    );
    const columns = ["Producto", "Precio", "Cantidad", "Total"];

    const rows = carrito.map((producto) => [
      producto.nombre,
      producto.precio,
      producto.cantidad,
      producto.precio * producto.cantidad,
    ]);

    doc.autoTable({
      startY: 55,
      head: [columns],
      body: rows,
    });
    doc.text(`Total: $${total}`, 170, 200);
    const iva = total * 0.15;
    doc.text(`IVA: $${iva.toFixed(2)}`, 170, 210);
    doc.text(`Total a pagar: $${(total + iva).toFixed(2)}`, 150, 220);
    doc.text("___________________________", 10, 260);
    doc.text("        Entregue", 15, 270);
    doc.text("___________________________", 143, 260);
    doc.text("        Recibí", 160, 270);
    doc.text("Gracias por su compra", 90, 275);
    doc.save(`factura_${numFactura}.pdf`);
    setContar(contar + 1);
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleTotal = () => {
    let total = 0;
    carrito.map((producto) => {
      total = total + producto.cantidad * producto.precio;
    });
    setTotal(Number(total.toFixed(2)));
  };

  useEffect(() => {
    handleTotal();
  }, [carrito]);

  useEffect(() => {
    handleNumFactura();
  }, [contar]);

  const handleAddCart = (producto) => {
    const { id, titulo, precio, imagen } = producto;
    setCarrito((prevCarrito) => {
      const existeProducto = prevCarrito.find((item) => item.id === id);
      if (existeProducto) {
        return prevCarrito.map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [
        ...prevCarrito,
        { id, nombre: titulo, precio, cantidad: 1, imagen },
      ];
    });
  };

  const handleRemoveFromCart = (id) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "Quitaras este producto del carrito de compra",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "green",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setCarrito((prevCarrito) =>
          prevCarrito.filter((item) => item.id !== id)
        );
      }
    });
  };

  const handleEmptyCart = () => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "Limpiaras todo el carrito de compra",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "green",
      confirmButtonText: "Vaciar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setCarrito([]);
        setTotal(0);
      }
    });
  };

  const handleIncrementQuantity = (id) => {
    setCarrito((prevCarrito) =>
      prevCarrito.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  const handleDecrementQuantity = (id) => {
    setCarrito(
      (prevCarrito) =>
        prevCarrito
          .map((item) =>
            item.id === id
              ? { ...item, cantidad: item.cantidad > 1 ? item.cantidad - 1 : 1 }
              : item
          )
          .filter((item) => item.cantidad > 0) // Remover si la cantidad llega a 0
    );
  };

  return (
    <div>
      <Box sx={{ padding: "1rem" }}>
        <Typography
          variant="h4"
          sx={{ marginBottom: "1.5rem", textAlign: "center" }}
        >
          Lista de Productos
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {data.length > 0 &&
            data.map((producto) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={producto.id}>
                <Card
                  variant="outlined"
                  sx={{ height: "100%", borderRadius: "12px" }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ textAlign: "center" }}
                    >
                      {producto.titulo}
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        height: "200px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "1rem 0",
                      }}
                    >
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        style={{ maxWidth: "100%", maxHeight: "100%" }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ textAlign: "center" }}>
                      Precio: ${producto.precio.toFixed(2)}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "center" }}>
                    <Tooltip title="Agregar al carrito">
                      <Button
                        size="small"
                        sx={{ color: "blue" }}
                        onClick={() => handleAddCart(producto)}
                      >
                        <AddShoppingCartIcon />
                      </Button>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
        <Box
          sx={{
            position: "fixed",
            bottom: "4%",
            right: "2%",
            zIndex: 1000,
          }}
        >
          <Tooltip title="Ver Carrito">
            <Fab color="primary" onClick={handleOpen}>
              <Badge badgeContent={carrito.length} color="warning">
                <ShoppingCartIcon />
              </Badge>
            </Fab>
          </Tooltip>
        </Box>
      </Box>

      <div>
        {open && (
          <>
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.55)",
                zIndex: 999,
                pointerEvents: "auto",
              }}
              onClick={handleOpen}
            />

            {/* Sidebar */}
            <Box
              sx={{
                position: "fixed",
                top: 0,
                right: 0,
                width: "300px",
                height: "100%",
                backgroundColor: "#eeeeee",
                zIndex: 1000,
                boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.5)",
                overflowY: "auto",
                padding: "16px",
              }}
            >
              <Button
                onClick={handleOpen}
                sx={{
                  right: "0",
                  top: "0",
                  position: "absolute",
                  color: "red",
                }}
              >
                <CloseIcon />
              </Button>
              <div>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ textAlign: "center" }}
                >
                  Carrito de compra
                </Typography>
              </div>
              {carrito.length === 0 && (
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "50%",
                    color: "grey",
                  }}
                >
                  No hay productos en el carrito
                </Typography>
              )}
              {carrito.length > 0 &&
                carrito.map((producto) => (
                  <Card
                    key={producto.id}
                    variant="outlined"
                    sx={{ marginTop: "18px", borderRadius: "12px" }}
                  >
                    <CardContent>
                      <Typography
                        variant="h5"
                        component="div"
                        sx={{ textAlign: "center" }}
                      >
                        {producto.nombre}
                      </Typography>
                      <Box
                        sx={{
                          width: "125px",
                          height: "125px",
                          display: "flex",
                          marginLeft: "50px",
                          justifyItems: "center",
                        }}
                      >
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          style={{ width: "100%", height: "100%" }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ textAlign: "center" }}>
                        Precio: ${producto.precio}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center" }}>
                      <Button
                        size="small"
                        sx={{ color: "red" }}
                        onClick={() => handleDecrementQuantity(producto.id)}
                      >
                        <RemoveIcon />
                      </Button>
                      <Typography>{producto.cantidad}</Typography>
                      <Button
                        size="small"
                        sx={{ color: "green" }}
                        onClick={() => handleIncrementQuantity(producto.id)}
                      >
                        <AddIcon />
                      </Button>
                      <Tooltip title="Eliminar del carrito">
                        <Button
                          size="small"
                          sx={{ color: "red" }}
                          onClick={() => handleRemoveFromCart(producto.id)}
                        >
                          <DeleteIcon />
                        </Button>
                      </Tooltip>
                    </CardActions>
                  </Card>
                ))}
              {carrito.length > 0 && (
                <Box
                  sx={{
                    display: "block",
                    justifyContent: "center",
                    textAlign: "center",
                    marginTop: "16px",
                    paddingBottom: "1.5rem",
                  }}
                >
                  <h2>Total: ${total}</h2>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginBottom: "8px" }}
                    onClick={handlePDF}
                  >
                    Comprar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={handleEmptyCart}
                  >
                    Vaciar Carrito
                  </Button>
                </Box>
              )}
            </Box>
          </>
        )}
      </div>
    </div>
  );
};

ComprarProducto.propTypes = {
  usuario: propTypes.func,
};

export default ComprarProducto;
