import EditData from "./EditData"
// types
import { DataPointType, UpdatedDataPointType } from "../../lib/types"
// mui
import DialogTitle from "@mui/material/DialogTitle"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"

interface EditDialogProps {
  item: DataPointType | UpdatedDataPointType
  isEditOpen: boolean
  handleEditClose: () => void
}

const EditDialog: React.FC<EditDialogProps> = ({ item, isEditOpen, handleEditClose }) => {
  //const manageState = useContext(ManageStateContext)

  return (
    <>
      <Dialog open={isEditOpen}>
        {/*  eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
        <DialogTitle>Edit {item?.displayDate ? item.displayDate : ""}</DialogTitle>
        <DialogContent>
          <EditData isEditOpen={isEditOpen} handleEditClose={handleEditClose} item={item} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EditDialog
