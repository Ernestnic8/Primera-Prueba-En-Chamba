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
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const car = {
  id: 0,
  nombre: "",
  precio: 0,
  cantidad: 0,
}

const ListProductContainer = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [carrito, setCarrito] = useState(car);
  const nav = useNavigate();

  const handleOpen = () => {
    console.log("open", open);
    setOpen(!open);
  };

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
    ],
    [categories]
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableEditing: true,
    onEditingRowSave: handleUpdate,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit" onClick={() => table.setEditingRow(row)}>
          <IconButton>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete" onClick={() => handleDelete(row)}>
          <IconButton color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="AddCarrito" onClick={() => console.log("AddCarrito")}>
          <IconButton color="success">
            <AddShoppingCartIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  return (
    <>
      <div className="container">
        <h1>Lista de productos</h1>
        <div>
          <button
            className="boton"
            onClick={() => {
              nav("/ecommerce/producto/registro");
            }}
          >
            Agregar Producto
          </button>
        </div>
        <div>
          <button
            className="boton"
            onClick={() => {
              handleCarga();
            }}
          >
            Actualizar
          </button>
        </div>
        <div className="table">
          <MaterialReactTable table={table} />
        </div>




      </div>

      <div style={{ position: "fixed", bottom: "0%", right: "0%" }}>
        <Box sx={{ m: 1 }}>
          <Fab color="primary" aria-label="add">
            <Badge badgeContent={1} color="warning" onClick={handleOpen}>
              <ShoppingCartIcon />
            </Badge>
          </Fab>
        </Box>
      </div>

      <div>
        {open && (
          <>
            {/* Fondo oscuro que cubre toda la pantalla */}
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
                boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.5)", // Sombra para dar profundidad
                overflowY: "auto",
                padding: "16px",
              }}
            >
              <Card open={open} onClose={handleOpen} variant="outlined">
                <h1>Carrito de compras</h1>
                <Button onClick={handleOpen} sx={{ marginBottom: "16px" }}>
                  Cerrar
                </Button>
                <CardContent>
                  <Typography
                    gutterBottom
                    sx={{ color: "text.secondary", fontSize: 14 }}
                  >
                    Word of the Day
                  </Typography>
                  <Typography variant="h5" component="div">
                    G
                  </Typography>
                  <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                    adjective
                  </Typography>
                  <Typography variant="body2">
                    well meaning and kindly.
                    <br />
                    {'"a benevolent smile"'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
            </Box>
          </>
        )}
      </div>
    </>
  );
};

export default ListProductContainer;
