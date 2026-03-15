import React, { useState } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Button from "react-bootstrap/Button";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function TodoRowItem(props) {
  const [showMovePopover, setShowMovePopover] = useState(false);
  const [moveDate, setMoveDate] = useState(dayjs(props.date));

  const todo = {
    rowNumber: props.rownumber,
    rowDescription: props.rowdesc,
    priority: props.rowpriority,
    status: props.status
  };

  const movePopover = (
    <Popover id={`move-popover-${todo.rowNumber}`}>
      <Popover.Header as="h3">Move Todo</Popover.Header>
      <Popover.Body>
        <div className="d-flex flex-column gap-2">
          <DatePicker
            value={moveDate}
            onChange={(newValue) => setMoveDate(newValue)}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
              }
            }}
          />

          <div className="d-flex gap-2 justify-content-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowMovePopover(false)}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (moveDate) {
                  props.onMoveTodo(
                    todo.rowNumber,
                    props.selectedDate.format(
                        "YYYY-MM-DD"
                    ),
                    moveDate.format("YYYY-MM-DD")
                  );
                  setShowMovePopover(false);
                }
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <tr>
      {/* <th scope="row">{props.rownumber}</th> */}
      <td className="p-3">{props.rowdesc}</td>
      <td>{props.rowpriority}</td>
      <td>{props.status}</td>

      <td>
  <div className="d-flex gap-2">

    <button
      className="btn btn-secondary btn-sm"
      onClick={() => props.onEdit(todo)}
    >
      <i className="bi bi-pencil"></i>
    </button>

    <OverlayTrigger
      trigger="click"
      placement="left"
      show={showMovePopover}
      overlay={movePopover}
      rootClose={false}
    >
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => setShowMovePopover(!showMovePopover)}
      >
        <i className="bi bi-arrow-up-right-circle-fill"></i>
      </button>
    </OverlayTrigger>

    <button
      className="btn btn-danger btn-sm"
      onClick={() => props.delete_todo(props.rownumber)}
    >
      <i className="bi bi-trash"></i>
    </button>

  </div>
</td>
    </tr>
  );
}

export default TodoRowItem;