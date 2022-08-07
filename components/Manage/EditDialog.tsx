import EditData from "./EditData"

// types
import { DataPointType } from "../../lib/types"

// mui

import DialogTitle from "@mui/material/DialogTitle"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"

import Button from "@mui/material/Button"

interface EditDialogProps {
  isEditOpen: boolean
  editSelectedValue: string
  onEditClose: (value: string) => void
  item: DataPointType
}

const EditDialog: React.FC<EditDialogProps> = ({ onEditClose, editSelectedValue, isEditOpen, item }) => {
  const handleEditClose = () => {
    onEditClose(editSelectedValue)
  }

  /* const handleListItemClick = (value: string) => {
    onClose(value)
  } */

  const handleEditSubmit = () => {
    alert("edit submitted")
    onEditClose(editSelectedValue)
  }

  return (
    <Dialog onClose={handleEditClose} open={isEditOpen}>
      {/*  eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
      <DialogTitle>Edit {`${item.displayDate}`}</DialogTitle>
      <DialogContent>
        <EditData item={item} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEditSubmit} autoFocus>
          Submit
        </Button>
        <Button onClick={handleEditClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditDialog
