import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  apiProductPut,
  apiProductsGet,
  apiProductDelete,
} from "../../api/producto/apiProducts";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";

const ListProductContainer = () => {
  const [data, setData] = useState([]);
  const nav = useNavigate();

  const handleCarga = () => {
    apiProductsGet().then((res) => {
      setData(res.data);
    });
  };

  useEffect(() => {
    handleCarga();
  }, []);

  const handleUpdate = ({ values, table }) => {
    const { id } = values;
    apiProductPut(id, values)
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
      });
  };

  const handleDelete = (row) => {
    const { id } = row.original;
    apiProductDelete(id)
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
  };

  const columns = useMemo(
    () => [      
      {
        accessorKey: "id", //access nested data with dot notation
        header: "ID",
        size: 50,
      },
      {
        accessorKey: "title", //access nested data with dot notation
        header: "Titulo",
        size: 150,
      },
      {
        accessorKey: "price",
        header: "Precio",
        size: 150,
        Cell: ({ cell }) => {
          return <span>{`$${cell.row.original.price}`}</span>;
        },
      },
      {
        accessorKey: "description",
        header: "Descripcion",
        size: 200,
      },
      {
        accessorKey: "category.name",
        header: "Categoria",
        size: 150,
      },
    ],
    []
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
              nav("/home/register");
            }}
          >
            Agregar Producto
          </button>
        </div>
        <div className="table">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </>
  );
};

export default ListProductContainer;
