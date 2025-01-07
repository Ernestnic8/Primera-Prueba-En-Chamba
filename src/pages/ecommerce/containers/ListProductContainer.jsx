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
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";


const ListProductContainer = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const nav = useNavigate();

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleTotal =()=>{
    let total=0;
    carrito.map((producto) => {
      total=total+(producto.cantidad * producto.precio);
    });
    setTotal(total);
  }

  useEffect(() => {
    handleTotal();
  }, [carrito]);

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

  const handleAddCart=(producto)=>{
    const {titulo,precio,imagen, id} = producto;
    console.log(producto);
    setCarrito([...carrito,{id:id,nombre:titulo,precio:precio,cantidad:1,imagen:imagen}]);
    console.log(carrito);
  }

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
      }
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
        <Tooltip title="AddCarrito" onClick={() => handleAddCart(row.original)}>
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

      <div style={{ position: "fixed", bottom: "4%", right: "0%", zIndex: 1000 }}>
        <Box sx={{ m: 1 }} onClick={handleOpen}
          >
          <Fab color="primary" aria-label="add">
            <Badge badgeContent={carrito.length} color="warning">
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
                <Typography variant="h5" component="div" sx={{ textAlign: "center" }}>
                  Carrito de compra
                </Typography>
              </div>
              {carrito.length===0 && <Typography variant="h5" component="div" sx={{ textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "50%", color:"grey" }}>
                No hay productos en el carrito
              </Typography>}
              {carrito.length>0 && 
                carrito.map((producto) => 
                  (<Card key={producto.id}
                    open={open}
                    onClose={handleOpen}
                    variant="outlined"
                    sx={{ marginTop: "18px" }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          top: "12",
                          right: "0",
                          position: "absolute",
                        }}
                      >
                        <Button sx={{ color: "red" }} onClick={()=>setCarrito([])} >
                          <DeleteIcon />
                        </Button>
                      </Box>
                      <Typography
                        variant="h5"
                        component="div"
                        sx={{ textAlign: "center" }}
                      >
                        {producto.nombre || ""}
                      </Typography>
                      <Box
                        sx={{
                          width: "150px",
                          height: "150px",
                          display: "flex",
                          marginLeft:"50px",
                          justifyItems: "center",
                        }}
                      >
                        <img
                          src={producto.imagen || ""}
                          alt="televisor"
                        />
                      </Box>
                      <Typography variant="body2" sx={{ textAlign: "center" }}>
                        Precio
                        <br />
                        {"$" + producto.precio || ""}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center" }}>
                      <Button size="small" sx={{ color: "red" }} onClick={()=>producto.cantidad=producto.cantidad-1} >
                        <RemoveIcon />
                      </Button>
                      <Box
                        sx={{ display: "flex", alignItems: "center", marginX: 1 }}
                      >
                        <Typography>{carrito[0].cantidad}</Typography>
                      </Box>
                      <Button size="small" sx={{ color: "green" }} onClick={()=>producto.cantidad=producto.cantidad+1}>
                        <AddIcon />
                      </Button>
                    </CardActions>
                  </Card>)
                
                )
              }              
              <Box
                sx={{
                  display: "block",
                  justifyContent: "center",
                  textAlign: "center",
                  marginTop: "16px",
                }}
              >
                <h2>{ carrito.length>0 && "Total $"+ total}</h2>
                { carrito.length>0 && <Button sx={{ borderRadius: "10px", backgroundColor:"yellow" }}>Comprar</Button>}
              </Box>
            </Box>
          </>
        )}
      </div>
    </>
  );
};

export default ListProductContainer;
