import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Tooltip,
  Fab,
  Badge,
  Select,
  MenuItem,
  Slide,
} from "@mui/material";
import {
  obtenerProductos,
  modificarStock,
} from "../../../api/ecommerce/productosApi";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import { set } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import {
  agregarProducto,
  actualizarCantidad,
  eliminarProducto,
  limpiarCarrito,
} from "../../../redux/carritoSlice";
import { useDispatch, useSelector } from "react-redux";

const ComprarProducto = () => {
  const [data, setData] = useState([]);
  const doc = new jsPDF({ format: "letter" });
  const [numFactura, setNumFactura] = useState(0);
  const [contar, setContar] = useState(0);
  const [total, setTotal] = useState(0);
  const [abrir, setAbrir] = useState(false);
  const [open, setOpen] = useState(false);
  const [productos, setProductos] = useState([]);
  const dispatch = useDispatch();
  const carrt = useSelector((state) => state.carrito);
  const usuario = useSelector((state) => state.usuario.data);

  const [cardStyle, setCardStyle] = useState("default");

  const cardStyles = {
    default: {
      card: {
        borderRadius: "12px",
        border: "1px solid #ddd",
        backgroundColor: "#fff",
        transition: "transform 0.3s",
        "&:hover": {
          transform: "scale(1.05)",
        },
      },
      imageContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "1rem 0",
      },
    },
    gradient: {
      card: {
        borderRadius: "15px",
        background: "linear-gradient(135deg, #ff7eb3, #ff758c)",
        color: "#fff",
        padding: "1rem",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        transition: "transform 0.3s",
        "&:hover": {
          transform: "translateY(-10px)",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
        },
      },
      imageContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "1rem 0",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
      },
    },
    minimal: {
      card: {
        borderRadius: "20px",
        border: "1px solid #e0e0e0",
        backgroundColor: "#f9f9f9",
        padding: "1.5rem",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.03)",
          backgroundColor: "#ffffff",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        },
      },
      imageContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "1.5rem 0",
        backgroundColor: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #ddd",
      },
    },
  };

  const currentStyle = cardStyles[cardStyle];

  const handleNumFactura = () => {
    setNumFactura(Math.floor(Math.random() * 100000));
  };

  useEffect(() => {
    setProductos(carrt.data);
  }, [carrt]);

  const handleCarga = () => {
    obtenerProductos().then((res) => {
      setData(res.data.response);
    });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
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

    const rows = productos.map((producto) => [
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
    handleStock(productos);
  };

  const handleOpen = () => {
    setAbrir(!abrir);
  };

  const handleStock = (producto) => {
    producto.map((item) => {
      const { id, stock, cantidad } = item;
      const nuevaCantidad = stock - cantidad;
      const data = { id: id, stock: nuevaCantidad };
      modificarStock(id, data)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Se ha realizado la compra",
            color: "green",
            confirmButtonColor: "green",
          });
          handleCarga();
          dispatch(limpiarCarrito());
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Error al procesar la compra",
            text: error.response.data.message,
            color: "red",
            confirmButtonColor: "red",
          });
        });
    });
    // modificarStock(id, { stock: stock - cantidad });
  };

  const handleTotal = () => {
    let total = 0;
    productos.map((producto) => {
      total = total + producto.cantidad * producto.precio;
    });
    setTotal(Number(total.toFixed(2)));
  };

  useEffect(() => {
    handleTotal();
  }, [productos]);

  useEffect(() => {
    handleNumFactura();
  }, [contar]);

  const handleAddCart = (producto) => {
    const { id, titulo, precio, imagen, stock } = producto;
    stock > 0
      ? (dispatch(
        agregarProducto({
          id,
          nombre: titulo,
          precio,
          cantidad: 1,
          imagen,
          stock,
        })
      ), setOpen(true))
      : Swal.fire({
        icon: "error",
        title: "Producto no disponible",
        color: "red",
        text: "Lo sentimos, no hay stock disponible",
        confirmButtonColor: "red",
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
        dispatch(eliminarProducto(id));
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
        setTotal(0);
        dispatch(limpiarCarrito());
      }
    });
  };

  const handleIncrementQuantity = (producto) => {
    const { id, stock } = producto;
    dispatch(actualizarCantidad({
      id, cantidad: stock === producto.cantidad
        ? producto.cantidad
        : producto.cantidad + 1,
    }));
  };

  const handleDecrementQuantity = (producto) => {
    const { id } = producto;
    dispatch(
      actualizarCantidad({
        id, cantidad:
          producto.cantidad > 1 ?
            producto.cantidad - 1 : 1
      })
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

        {/* Selector de estilo */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
          <Select
            value={cardStyle}
            onChange={(e) => setCardStyle(e.target.value)}
            sx={{ minWidth: "200px" }}
          >
            <MenuItem value="default">Estilo Predeterminado</MenuItem>
            <MenuItem value="gradient">Gradiente</MenuItem>
            <MenuItem value="minimal">Minimalista</MenuItem>
          </Select>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {data.length > 0 &&
            data.map((producto) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={producto.id}>
                <Card
                  variant="outlined"
                  sx={currentStyle.card}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ textAlign: "center", fontWeight: "bold" }}
                    >
                      {producto.titulo}
                    </Typography>
                    <Box sx={currentStyle.imageContainer}>
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        style={{ maxWidth: "100%", maxHeight: "100%" }}
                      />
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ textAlign: "center", color: "#757575", margin: "0.5rem 0" }}
                    >
                      Disponibles: {producto.stock}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: "center",
                        color: "#424242",
                        fontWeight: "bold",
                      }}
                    >
                      Precio: ${producto.precio.toFixed(2)}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "center" }}>
                    <Tooltip title="Agregar al carrito">
                      <Button
                        size="small"
                        sx={{
                          color: "#2196f3",
                          border: "1px solid #2196f3",
                          "&:hover": {
                            backgroundColor: "#2196f3",
                            color: "#fff",
                          },
                        }}
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
              <Badge badgeContent={productos.length} color="warning">
                <ShoppingCartIcon />
              </Badge>
            </Fab>
          </Tooltip>
        </Box>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={800}
        onClose={handleClose}
        transitionDuration={1000}
        TransitionComponent={Slide}
        message="Se ha agregado al carrito"
        variant="success"
      ></Snackbar>
      <div>
        {abrir && (
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
              {productos.length === 0 && (
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
              {productos.length > 0 &&
                productos.map((producto) => (
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
                        Disponible: {producto.stock - producto.cantidad}
                      </Typography>
                      <Typography variant="body2" sx={{ textAlign: "center" }}>
                        Precio: ${producto.precio}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center" }}>
                      <Button
                        size="small"
                        sx={{ color: "red" }}
                        onClick={() => handleDecrementQuantity(producto)}
                      >
                        <RemoveIcon />
                      </Button>
                      <Typography>{producto.cantidad}</Typography>
                      <Button
                        size="small"
                        sx={{ color: "green" }}
                        onClick={() => handleIncrementQuantity(producto)}
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
              {productos.length > 0 && (
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


export default ComprarProducto;
