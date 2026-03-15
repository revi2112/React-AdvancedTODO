import TodoRowItem from "./TodoRowItem"

function TodoTable(props){

    return(
        <table className = 'table table-hover'>
        <thead>
          <tr>
            {/* <th scope = 'col'>#</th> */}
            <th scope = 'col' className="p-2">Description</th>
            <th scope = 'col'>Priority</th>
            <th scope = 'col'>Satus</th>
            {/* <th scope = 'col'>Edit Row</th>
            <th scope = 'col'>Move Row</th>
            <th scope = 'col'>Delete Row</th> */}
            <th>Actions</th>

          </tr>
        </thead>
        <tbody>
          

          {props.todo_list.map(todo => (
            <TodoRowItem
            key={todo.rowNumber}
            rownumber = {todo.rowNumber}
            rowdesc = {todo.rowDescription}
            rowpriority = {todo.priority}
            status = {todo.status}
            delete_todo = {props.delete_todo}
            onEdit={props.onEdit}
            onMoveTodo={props.onMoveTodo}
            selectedDate = {props.selectedDate}
            />
          ))}
    
        </tbody>
      </table>
    )
}

export default TodoTable