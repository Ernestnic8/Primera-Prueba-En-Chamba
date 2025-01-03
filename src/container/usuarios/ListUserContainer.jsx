import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  apiUsersDelete,
  apiUsersGet,
  apiUsersPut,
} from "../../api/usuario/apiUsers";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";

const ListUserContainer = () => {
  const [data, setData] = useState([]);

  const handleCarga = () => {
    apiUsersGet().then((res) => {
      setData(res.data);
    });
  };

  useEffect(() => {
    handleCarga();
  }, []);

  const handleUpdate = ({ values, table }) => {
    const { id } = values;
    apiUsersPut(id, values)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Usuario actualizado",
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
          title: "Error al actualizar al usuario",
          text: error.response.data.message,
          color: "red",
          confirmButtonColor: "red",
        });        
        table.setEditingRow(null);
      });
  };

  const handleDelete = (row) => {
    const { id } = row.original;
    apiUsersDelete(id)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Usuario eliminado",
          color: "green",
          confirmButtonColor: "green",
        });
        handleCarga();
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al eliminar el Usuario",
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
        enableEditing: false,
        size: 50,
      },
      {
        accessorKey: "name",
        header: "Nombre",
        size: 150,
      },
      {
        accessorKey: "email", //access nested data with dot notation
        header: "Correo",
        size: 200,
      },
      {
        accessorKey: "role",
        header: "Role",
        size: 150,
        enableEditing: false,
      },
      {
        accessorKey: "password",
        header: "contraseña",
        size: 150,
        Cell: ({ cell, columns }) => {
          return (
            <span>{`${cell.row.original.password.replace(/./g, "*")}`}</span>
          );
        },
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
        <h1>Lista de Usuarios</h1>
        <div className="table">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </>
  );
};

export default ListUserContainer;
