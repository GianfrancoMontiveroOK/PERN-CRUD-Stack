import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TaskList() {
  //NAVEGACION
  const navigate = useNavigate();
  const params = useParams();

  //ESTADOS
  //ESTADO FORMULARIO
  const [task, setTask] = useState({
    title: "",
    description: "",
  });
  // ESTADO CARGANDO / LOADING.......
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  // HANDLERS
  // HANDLER BOTON
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (editing) {
      await fetch(`http://localhost:4000/tasks/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body:(JSON.stringify(task))
      });
      
    } else {
      const res = await fetch("http://localhost:4000/tasks", {
        method: "POST",
        body: JSON.stringify(task),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log(data);
    }
    setLoading(false);
    navigate("/");
  };

  //HANDLER ESTADO IMPUT
  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value }); //NAME
  };

  const loadTask = async (id) => {
    const res = await fetch(`http://localhost:4000/tasks/${id}`);
    const data = await res.json();
    setTask({ title: data.title, description: data.description });
    setEditing(true);
  };

  useEffect(() => {
    if (params.id) {
      loadTask(params.id);
    }
  }, [params.id]);

  // ################################################ TASKFORM DEVUELVE.... ##############################################
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={3}>
        <Card style={{ mt: 5, padding: "1rem", backgroundColor: "#1e272e" }}>
          <Typography
            variant="h6"
            style={{ color: "white", textAlign: "center" }}
          >
            {editing ? "Edit Task" : "Add Task"}
          </Typography>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                variant="filled"
                label="Write Your Title"
                style={{ display: "block", margin: ".5rem 0" }}
                name="title"
                value={task.title}
                onChange={handleChange}
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />
              <TextField
                variant="filled"
                label="Write Your Description"
                multiline
                minRows={4}
                style={{ display: "block", margin: ".5rem 0" }}
                name="description"
                value={task.description}
                onChange={handleChange}
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!task.title || !task.description}
              >
                {loading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  "Save"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
