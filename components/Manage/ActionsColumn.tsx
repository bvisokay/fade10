import { useState, useContext } from "react"
import { ManageStateContext } from "../../store/ManageContext"

//comps
import DeleteDialog from "./DeleteDialog"
import EditDialog from "./EditDialog"

// mui

import { FormControlLabel, IconButton } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"

interface PropTypes {
  index: number
}

const ActionsColumn: React.FC<PropTypes> = ({ index }) => {
  const manageStateContext = useContext(ManageStateContext)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editSelectedValue /* setSelectedValue */] = useState("Hello Edit")
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteSelectedValue, setDeleteSelectedValue] = useState<string | undefined>("")

  const handleEditOpen = () => {
    setIsEditOpen(true)
  }

  const handleEditClose = () => {
    setIsEditOpen(false)
  }

  const handleDeleteOpen = () => {
    setIsDeleteOpen(true)
  }

  const handleDeleteClose = () => {
    setIsDeleteOpen(false)
  }

  return (
    <>
      <FormControlLabel
        label={""}
        control={
          <>
            <IconButton color="secondary" aria-label="edit" onClick={handleEditOpen}>
              <EditIcon style={{ color: "dodgerblue" }} />
            </IconButton>
            <EditDialog editSelectedValue={editSelectedValue} isEditOpen={isEditOpen} onEditClose={handleEditClose} item={manageStateContext.spy[index - 1]} />
            <IconButton color="secondary" aria-label="delete" onClick={handleDeleteOpen} style={{ marginLeft: "4px" }}>
              <DeleteIcon style={{ color: "crimson" }} />
            </IconButton>
            <DeleteDialog deleteSelectedValue={deleteSelectedValue} setDeleteSelectedValue={setDeleteSelectedValue} isDeleteOpen={isDeleteOpen} onDeleteClose={handleDeleteClose} item={manageStateContext.spy[index - 1]} />
          </>
        }
      />
    </>
  )
}

export default ActionsColumn
