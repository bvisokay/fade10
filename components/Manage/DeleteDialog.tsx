import { useContext } from "react"
import { ManageDispatchContext } from "../../store/ManageContext"

// types
import { ResponseType, DataPointType } from "../../lib/types"

// mui
import DialogTitle from "@mui/material/DialogTitle"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import Button from "@mui/material/Button"

const sendDeleteRequest = async (payload: string[]) => {
  console.log("payload: ", payload)
  try {
    const response = await fetch("/api/delete-item", {
      method: "DELETE",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const responseData = (await response.json()) as ResponseType
    console.log(responseData)
    if (responseData.message === "success") {
      return { message: "success" }
    }
    if (responseData.message !== "success") {
      throw { message: "error" }
    }
  } catch (err) {
    console.log(err)
    return { message: "Error", errors: err }
  }
}

interface DeleteDialogProps {
  isDeleteOpen: boolean
  deleteSelectedValue: string | undefined
  onDeleteClose: (value: string | undefined) => void
  item: DataPointType
  setDeleteSelectedValue: React.Dispatch<React.SetStateAction<string | undefined>>
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ onDeleteClose, deleteSelectedValue, isDeleteOpen, item }) => {
  //console.log("item: ", item)

  const manageDispatch = useContext(ManageDispatchContext)

  const handleDeleteClose = () => {
    onDeleteClose(deleteSelectedValue)
  }

  const handleDeleteAccept = () => {
    let itemToDelete: string | undefined
    sendDeleteRequest([item.date])
      .then(res => {
        if (res?.message === "success") {
          console.log(item.date)
          manageDispatch({ type: "removeItem", value: item.date })
        }
      })
      .catch(err => console.log(err))
    onDeleteClose(itemToDelete)
  }

  return (
    <Dialog onClose={handleDeleteClose} open={isDeleteOpen}>
      {/*  eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
      <DialogTitle>Delete {item.displayDate}?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">This action cannot be undone</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteAccept} autoFocus>
          Delete
        </Button>
        <Button onClick={handleDeleteClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog
