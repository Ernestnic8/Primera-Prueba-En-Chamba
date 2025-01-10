import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  actualizarProducto,
  obtenerProductos,
  eliminarProducto,
  categoriasApi,
} from "../../../api/ecommerce/productosApi";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Fab,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import propTypes from "prop-types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RefreshIcon from "@mui/icons-material/Refresh";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ListProductContainer = ({ usuario }) => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const nav = useNavigate();
  const doc = new jsPDF({ format: "letter" });
  const [numFactura, setNumFactura] = useState(0);
  const [contar, setContar] = useState(0);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id", //access nested data with dot notation
        header: "ID",
        enableEditing: false,
        size: 50,
      },
      {
        accessorKey: "titulo", //access nested data with dot notation
        header: "Titulo",
        size: 150,
      },
      {
        accessorKey: "categoriaId",
        header: "Categoria",
        size: 150,
        enableEditing: false,
        Cell: ({ cell }) => {
          return (
            <span>
              {categories.map((category) => {
                if (category.id === cell.row.original.categoriaId) {
                  return category.nombre;
                }
              })}
            </span>
          );
        },
      },
      {
        accessorKey: "precio",
        header: "Precio",
        size: 150,
        Cell: ({ cell }) => {
          return <span>{`$${cell.row.original.precio}`}</span>;
        },
      },
      {
        accessorKey: "imagen",
        header: "Imagen",
        size: 150,
        Cell: ({ cell }) => {
          return (
            <img
              src={cell.row.original.imagen}
              alt={cell.row.original.titulo}
              style={{ width: "100px", height: "100px" }}
            />
          );
        },
      },
    ],
    [categories]
  );

  const handleNumFactura = () => {
    setNumFactura(Math.floor(Math.random() * 100000));
  };

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

  const handleCarga = () => {
    categoriasApi().then((res) => {
      setCategories(res.data.response);
    });
    obtenerProductos().then((res) => {
      setData(res.data.response);
    });
  };

  useEffect(() => {
    handleCarga();
  }, []);

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

  const handleUpdate = ({ values, table }) => {
    const { id } = values;
    actualizarProducto(id, values)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Producto actualizado",
          color: "green",
          confirmButtonColor: "green",
        });
        table.setEditingRow(null);
        handleCarga();
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Error al actualizar el producto",
          text: error.response.data.message,
          color: "red",
          confirmButtonColor: "red",
        });
        table.setEditingRow(null);
      });
  };

  const handleDelete = (row) => {
    const { id } = row.original;
    Swal.fire({
      title: "¿Estas seguro?",
      text: "No podras revertir esta accion",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "green",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarProducto(id)
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Producto eliminado",
              color: "green",
              confirmButtonColor: "green",
            });
            handleCarga();
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error al eliminar el producto",
              text: error.response.data.message,
              color: "red",
              confirmButtonColor: "red",
            });
          });
      }
    });
  };

  // const table = useMaterialReactTable({
  //   columns,
  //   data,
  //   enableEditing: true,
  //   onEditingRowSave: handleUpdate,
  //   renderRowActions: ({ row, table }) => (
  //     <Box sx={{ display: "flex", gap: "1rem" }}>
  //       <Tooltip title="Edit" onClick={() => table.setEditingRow(row)}>
  //         <IconButton>
  //           <EditIcon />
  //         </IconButton>
  //       </Tooltip>
  //       <Tooltip title="Delete" onClick={() => handleDelete(row)}>
  //         <IconButton color="error">
  //           <DeleteIcon />
  //         </IconButton>
  //       </Tooltip>
  //       <Tooltip title="AddCarrito" onClick={() => handleAddCart(row.original)}>
  //         <IconButton color="success">
  //           <AddShoppingCartIcon />
  //         </IconButton>
  //       </Tooltip>
  //     </Box>
  //   ),
  //   renderTopToolbarCustomActions: () => (
  //     <Box sx={{ display: "flex", gap: "1.5rem", paddingLeft: "1rem" }}>
  //       <Tooltip title="Actualizar" onClick={handleCarga}>
  //         <IconButton>
  //           <RefreshIcon />
  //         </IconButton>
  //       </Tooltip>
  //       <Tooltip
  //         title="Agregar Producto"
  //         onClick={() => {
  //           nav("/ecommerce/producto/registro");
  //         }}
  //       >
  //         <IconButton>
  //           <AddIcon />
  //         </IconButton>
  //       </Tooltip>
  //     </Box>
  //   ),
  // });

  return (
    <>
      {/* <div className="container">
        <h1>Lista de productos</h1>        
        <div className="table">
          <MaterialReactTable table={table} />
        </div>
      </div> */}

<Box sx={{ padding: "1rem" }}>
      <Typography variant="h4" sx={{ marginBottom: "1.5rem", textAlign: "center" }}>
        Lista de Productos
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {data.length > 0 &&
          data.map((producto) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={producto.id}>
              <Card variant="outlined" sx={{ height: "100%" }}>
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
                  <Tooltip title="Agregar al carrito">
                    <Button
                      size="small"
                      sx={{ color: "blue" }}
                      onClick={() => handleAddCart(producto)}
                    >
                      <AddShoppingCartIcon />
                    </Button>
                  </Tooltip>
                  <Button
                    size="small"
                    sx={{ color: "red" }}
                    onClick={() => handleRemoveFromCart(producto.id)}
                  >
                    <DeleteIcon />
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>

      {/* Floating Cart Button */}
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

      {/* Top Toolbar */}
      <Box
        sx={{
          display: "flex",
          gap: "1.5rem",
          padding: "1rem",
          justifyContent: "center",
        }}
      >
        <Tooltip title="Actualizar">
          <IconButton onClick={handleCarga}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Agregar Producto">
          <IconButton onClick={() => nav("/ecommerce/producto/registro")}>
            <AddIcon />
          </IconButton>
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
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Oscurecer fondo
                zIndex: 999, // Debajo del sidebar
                pointerEvents: "auto", // Captura los clics para evitar interacción con otros elementos
              }}
              onClick={handleOpen} // Cerrar el sidebar si se hace clic fuera
            />

            {/* Sidebar */}
            <Box
              sx={{
                position: "fixed",
                top: 0,
                right: 0,
                width: "300px", // Anchura fija del sidebar
                height: "100%",
                backgroundColor: "#fff", // Fondo del sidebar
                zIndex: 1000, // Por encima del fondo
                boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.7)", // Sombra para dar profundidad
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
                    sx={{ marginTop: "18px" }}
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
                      <Button
                        size="small"
                        sx={{ color: "red" }}
                        onClick={() => handleRemoveFromCart(producto.id)}
                      >
                        <DeleteIcon />
                      </Button>
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
    </>
  );
};

ListProductContainer.propTypes = {
  usuario: propTypes.func,
};

export default ListProductContainer;
