import './App.css';
import TodoTable from './Components/TodoTable';
import React, { useState, useEffect } from 'react';
import NewTodoForm from './Components/NewTodoForm';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle } from 'react-bootstrap';
import EditTodoForm from './Components/EditTodoForm';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ToastMesage from './Components/ToastMesage';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import StatsPanel from './Components/StatsPanel';
import Bg from './Components/Bg';

function App() {

  const [showAddTodoForm, setShowAddTodoForm] = useState(false);
  const [showEditTodoForm, setShowEditTodoForm] = useState(false);
  const [showMoveTodoForm, setShowMoveTodoForm] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(null);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs("2026-03-14"));
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [successMsg, setSuccessMsg] = useState('Todo Moved Successfully');
  const [showToast, setShowToast] = useState(false);
  const [todo_list, setTodoList] = useState({
    '2026-03-14': [
      { rowNumber: 1, rowDescription: 'Feed puppy', priority: "high", status: "Yet to Start" },
      { rowNumber: 2, rowDescription: 'Water plants', priority: "high", status: "Done" },
      { rowNumber: 3, rowDescription: 'Feed family', priority: "high", status: "Yet to Start" },
      { rowNumber: 4, rowDescription: 'Water to animals', priority: "high", status: "Done" },
      { rowNumber: 5, rowDescription: 'Feed neighbours', priority: "high", status: "Yet to Start" },
      { rowNumber: 6, rowDescription: 'Water to birds', priority: "high", status: "Done" }
    ],
    '2026-03-13': [
      { rowNumber: 1, rowDescription: 'Make dinner', priority: "medium", status: "In Progress" },
      { rowNumber: 2, rowDescription: 'Charge phone battery', priority: "low", status: "Yet to Start" },
      { rowNumber: 3, rowDescription: 'Feed puppy', priority: "high", status: "Yet to Start" },
      { rowNumber: 4, rowDescription: 'charge robo', priority: "high", status: "Done" },
      { rowNumber: 5, rowDescription: 'Feed cats', priority: "high", status: "Yet to Start" },
      { rowNumber: 6, rowDescription: 'apply jobs', priority: "high", status: "Done" }

    ]
  });

  const allTodos = Object.values(todo_list).flat();

  useEffect(() => {
    const dataKey = selectedDate.format("YYYY-MM-DD");
    setVisibleTodos(todo_list[dataKey] || []);
  }, [selectedDate, todo_list]);

  const add_todo = (newTodo) => {
    const dataKey = selectedDate.toISOString().split('T')[0];
    const current_todos = todo_list[dataKey] || [];
    const rowNumber = current_todos.length > 0
      ? Math.max(...todo_list[dataKey].map(t => t.rowNumber)) + 1
      : 1;

    const new_todo_toinsert = { rowNumber, ...newTodo }
    // todo_list.push(new_todo) // table doesn't get change thats when state comes into picture
    setTodoList({
      ...todo_list,
      [dataKey]: [...current_todos, new_todo_toinsert]
    })
  }

  const delete_todo = (toDeleteRownum) => {
    const dataKey = selectedDate.format("YYYY-MM-DD");
    const filtered_rows = todo_list[dataKey].filter(todo => todo.rowNumber !== toDeleteRownum);
    setTodoList({
      ...todo_list,
      [dataKey]: filtered_rows,
    });
  }

  const edit_todo = (updated_todo, todo_rownum) => {
    const dataKey = selectedDate.format("YYYY-MM-DD");
    const updatedRowNum = Number(todo_rownum);
    const updatedList = todo_list[dataKey].map((todo) =>
      todo.rowNumber === updatedRowNum ? { ...todo, ...updated_todo } : todo
    );
    setTodoList({
      ...todo_list,
      [dataKey]: updatedList,
    });
  };

  const handleEdit = (todo) => {
    setTodoToEdit(todo);
    setShowEditTodoForm(true);
  };

  const handleIndMoveTodo = (todo_rownum, oldDate, newDate) => {
    console.log(oldDate, newDate)
    setTodoList(prev => {

      const updated = { ...prev }

      const todo_to_move = updated[oldDate].find((t) => t.rowNumber === todo_rownum)
      if (!todo_to_move) return prev

      updated[oldDate] = updated[oldDate].filter((t) => t.rowNumber !== todo_rownum)

      if (!updated[newDate]) {
        updated[newDate] = []
      }

      // add to new date
      updated[newDate].push(todo_to_move)

      return updated

    })
  }

  const move_todo = () => {
    //"2025-06-17T22:30:52.123Z"
    //Tue Jun 17 2025 17:30:52 GMT-0500 (Central Daylight Time)

    const fromKey = fromDate.format("YYYY-MM-DD");
    const toKey = toDate.format("YYYY-MM-DD");
    const maxRowInDest = todo_list[toKey].length > 0
      ? Math.max(...todo_list[toKey].map(t => t.rowNumber))
      : 1;

    var todo_to_migrate = (todo_list[fromKey] || []).filter(todo => todo.status !== 'Done');
    const todo_to_migrate_row_num = todo_to_migrate.map((todo, idx) => ({
      ...todo,
      rowNumber: maxRowInDest + idx + 1
    }));
    const todo_to_remain_from = (todo_list[fromKey] || []).filter(todo => todo.status === 'Done');

    const todo_to_key = [...(todo_list[toKey] || []), ...todo_to_migrate_row_num]

    setTodoList(
      {
        ...todo_list,
        [fromKey]: todo_to_remain_from,
        [toKey]: todo_to_key
      }
    );

    setShowMoveTodoForm(false);
    setShowToast(true);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <>
        <Bg />
        <div className="container-lg mt-5 pb-5">
          <div className="row align-items-start g-4">
            <div className="col-3">
              <div className='card p-3'>
                <StatsPanel todo_list={todo_list} />
              </div>

            </div>
            <div className="col-9">
              <div className='card'>
                <div className='card-header'>
                  <div className="d-flex justify-content-between">
                    <h5 className="mb-0">Your Todo's</h5>
                    <div>
                      <DatePicker
                        value={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        slotProps={{ textField: { size: "small", fullWidth: true } }}
                      />

                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "60px", alignItems: "flex-start" }}>

                  {/* <StatsPanel todo_list={todo_list} />

            <div className="card" style={{ flex: 1 }}>
              <div className="card-body"> */}

                  <TodoTable
                    todo_list={visibleTodos}
                    delete_todo={delete_todo}
                    onEdit={handleEdit}
                    selectedDate={selectedDate}
                    onMoveTodo={handleIndMoveTodo}
                  />

                  {/* </div>
            </div> */}

                </div>
                {/* <button className='btn btn-primary' onClick={() => setShowAddTodoForm(!showAddTodoForm)}> 
          {showAddTodoForm ? 'Close New Todo' : 'New Todo'}
          </button> */}
                <div className="d-flex justify-content-between">
                  <button className="btn btn-primary" onClick={() => setShowAddTodoForm(true)}>
                    Add New Todo
                  </button>

                  <button className="btn btn-primary" onClick={() => setShowMoveTodoForm(true)}>
                    Move Your Todo
                  </button>
                </div>
                <Modal
                  show={showAddTodoForm}
                  onHide={() => setShowAddTodoForm(false)}
                >
                  <ModalHeader closeButton>
                    <ModalTitle>New Todo </ModalTitle>
                  </ModalHeader>
                  <ModalBody>
                    <NewTodoForm
                      add_todo={add_todo}
                      closeForm={() => setShowAddTodoForm(false)} />
                  </ModalBody>
                  <ModalFooter></ModalFooter>

                </Modal>

                <EditTodoForm
                  show={showEditTodoForm}
                  edit_todo={edit_todo}
                  // send todo that is clicked
                  todo={todoToEdit}
                  onClose={() => setShowEditTodoForm(false)}
                />
                <ToastMesage
                  show={showToast}
                  onClose={() => setShowToast(false)}
                  errorMsg={successMsg}
                  toastVariant={"success"}
                />
                {showMoveTodoForm &&
                  <Modal show={true}
                    onHide={() => setShowMoveTodoForm(false)}
                    centered>
                    <ModalHeader closeButton>
                      <ModalTitle>Move Your Todo's</ModalTitle>
                    </ModalHeader>

                    <ModalBody>
                      <div className='mb-3'>
                        <label className='p-2'>From Date:</label>
                        <DatePicker
                          value={selectedDate}
                          onChange={(newValue) => setFromDate(newValue)}
                          slotProps={{ textField: { size: "small" } }}

                        />

                      </div>

                      <div className='mb-3'>
                        <label className='p-2'> To Date:</label>
                        <DatePicker
                          value={toDate}
                          onChange={(newValue) => setToDate(newValue)}
                          slotProps={{ textField: { size: "small" } }}

                        />
                      </div>
                    </ModalBody>

                    <ModalFooter>
                      <button className='btn btn-primary' onClick={move_todo}>Move Todo</button>
                      <button className='btn btn-secondary' onClick={() => setShowMoveTodoForm(false)}>Cancel</button>

                    </ModalFooter>
                  </Modal>
                }


              </div>
            </div>
          </div>
        </div>
      </>

    </LocalizationProvider >
  );
}

export default App;