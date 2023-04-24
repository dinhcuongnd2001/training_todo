import { useAppSelector } from '@/hooks/common';
import Modal from '@mui/material/Modal';
import { Dispatch, SetStateAction } from 'react';

export interface AddAssigneeProps {
  openAddAssignee: boolean;
  setOpenAddAssignee: Dispatch<SetStateAction<boolean>>;
}

function AddAssignee({ openAddAssignee, setOpenAddAssignee }: AddAssigneeProps) {
  const listUser = useAppSelector((state) => state.users.users);

  return (
    <div>
      <Modal
        open={openAddAssignee}
        onClose={() => {
          setOpenAddAssignee(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <h1></h1>
      </Modal>
    </div>
  );
}

export default AddAssignee;
