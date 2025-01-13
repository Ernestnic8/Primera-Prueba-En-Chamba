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
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";

const ListProductContainer = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(10);
  const nav = useNavigate();

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableEditing: false,
        size: 50,
      },
      {
        accessorKey: "titulo",
        header: "Titulo",
        size: 150,
        Cell: ({ cell }) => {
          return <span>{cell.row.original.titulo}</span>;
        },
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
      {
        accessorKey: "stock",
        header: "Cantidad Disponible",
        size: 50,
        Cell: ({ cell }) => {
          return (
            <Box sx={{ textAlign: "center", fontWeight: "bold" }}>
              {cell.row.original.stock}
            </Box>
          );
        },
      },
    ],
    [categories]
  );

  const handleCarga = () => {
    setLoading(true);
    categoriasApi().then((res) => {
      setCategories(res.data.response);
    });
    obtenerProductos().then((res) => {
      setData(res.data.response);
      setLoading(false);
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    handleCarga();
  }, []);

  const handleUpdate = ({ values, table }) => {
    const { id } = values;
    setLoading(true);
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
        setLoading(false);
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
        setLoading(false);
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

  const table = useMaterialReactTable({
    columns,
    data,
    enableEditing: true,
    onEditingRowSave: handleUpdate,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Editar" onClick={() => table.setEditingRow(row)}>
          <IconButton>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar" onClick={() => handleDelete(row)}>
          <IconButton color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: "1.5rem", paddingLeft: "1rem" }}>
        <Tooltip title="Actualizar" onClick={handleCarga}>
          <IconButton>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title="Agregar Producto"
          onClick={() => {
            nav("/ecommerce/producto/registro");
          }}
        >
          <IconButton>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  return (
    <>
      {loading && (
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
          }}
        >
          <Typography
            variant="caption"
            component="div"
            sx={{ color: "text.secondary" }}
          >
            {`${Math.round(progress)}%`}
          </Typography>
          <CircularProgress color="secondary" size={40} value={progress} />
        </Box>
      )}
      <div className="container">
        <h1>Lista de productos</h1>
        <div className="table">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </>
  );
};

export default ListProductContainer;
