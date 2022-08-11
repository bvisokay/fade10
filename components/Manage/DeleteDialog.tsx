import { useContext } from "react"
import { ManageDispatchContext } from "../../store/ManageContext"

// types
import { ResponseType, DataPointType, UpdatedDataPointType } from "../../lib/types"

// mui
import DialogTitle from "@mui/material/DialogTitle"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import Button from "@mui/material/Button"

const sendDeleteRequest = async (payload: string[]) => {
  try {
    const response = await fetch("/api/delete-item", {
      method: "DELETE",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const responseData = (await response.json()) as ResponseType

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
  handleDeleteClose: () => void
  item: DataPointType | UpdatedDataPointType
  //setDeleteSelectedValue: React.Dispatch<React.SetStateAction<string | undefined>>
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ handleDeleteClose, isDeleteOpen, item }) => {
  //console.log("item: ", item)

  const manageDispatch = useContext(ManageDispatchContext)

  const handleDeleteAccept = () => {
    sendDeleteRequest([item.date])
      .then(res => {
        if (res?.message === "success") {
          manageDispatch({ type: "removeItem", value: item.date })
        }
      })
      .catch(err => console.log(err))
    handleDeleteClose()
  }

  return (
    <Dialog onClose={handleDeleteClose} open={isDeleteOpen}>
      {/*  eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
      <DialogTitle>Delete {item?.displayDate ? item.displayDate : "Item"}?</DialogTitle>
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
