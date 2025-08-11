
  // import { createClient } from '@supabase/supabase-js'
  const supabaseUrl = 'https://xwwowgklxvfmcjzdnhaq.supabase.co'
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3d293Z2tseHZmbWNqemRuaGFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NDk4MzUsImV4cCI6MjA2OTEyNTgzNX0.X3gOUHHTcB5I1x9iZy5twify2bjY2Re_YMeR6veIUpQ"
  const client = supabase.createClient(supabaseUrl, supabaseKey)

  console.log(client);


  let todo_input = document.getElementById('todo-input');
  let add_todo = document.getElementById('add-todo');
  let todo_list = document.getElementById('todo-list');
  let clear_all = document.getElementById('clear-all');
  
  let todo = [];

  window.onload = function () {
    getshow();
  add_todo.addEventListener('click',async function () {
      let todo_text = todo_input.value.trim();


      
      if (!todo_text) {
        toastr.error('Todo text cannot be empty', 'Error');
            return;
        
      }
      const { error } = await client
    .from('Todo_list')
    .insert({ Todotext: todo_text })
      

      if (error) {
          console.error('Error adding todo:', error);
          return;
      }else{
        toastr.success('Task Add', 'success');

          getshow();
      }
  

      // console.log(`Adding todo: ${todo_text}`);
      
      todo_input.value = ''; 
  })

  }


  async function getshow() {
      const { data, error } = await client
    .from('Todo_list')
    .select()


    if (error) {
      console.error('Error fetching todos:', error);
      return;
      
    }else{
      console.log('Fetched todos:', data);
       
       if (data.length >0) {
          clear_all.style.display = 'block'; 
        }else{
          clear_all.style.display = 'none';
        }
      
        todo = data;
      console.log('Todo list:', todo);

      todo_list.innerHTML = '';
      for (let i = 0; i < data.length; i++) {
       
          todo_list.innerHTML += `<li>${i + 1} ${data[i].Todotext.charAt(0).toUpperCase()}${data[i].Todotext.slice(1).toLowerCase()}
           <div class="todo-buttons">
        <button onclick="deleteTodo(${data[i].id})"><i class="fa-solid fa-trash"></i></button>
        <button class="edit-btn" onclick="editTodo(${[i]})"><i class="fa-regular fa-pen-to-square"></i></button>
      </div>
          </li>
         
           `
           ;  
          
          
      }
      
  }

  }
  // getshow()




  async function deleteTodo(id) {
  const { error } = await client
    .from('Todo_list')
    .delete()
    .eq('id', id);

  if (error) {
      console.error('Error deleting todo:', error);
      return;
    }else{
      console.log(`Todo with id ${id} deleted successfully`);
      getshow(); 
    }
      
  }

  



  clear_all.addEventListener('click', async function () {
      const { error } = await client
    .from('Todo_list')
    .delete()
    .neq('id', 0); 

      if (error) {
          console.error('Error clearing todos:', error);
          return;
      }else{
          todo_list.innerHTML = '';
           toastr.success('All todos cleared successfully', 'success');
          
      }
  });


  async function editTodo(index) {
     todo_input.value = todo[index].Todotext;
      
  let newButton = add_todo.cloneNode(true);
  add_todo.parentNode.replaceChild(newButton, add_todo);
  add_todo = newButton; 
      add_todo.textContent = 'Update';
         
      add_todo.addEventListener('click' , async function () {
      let updatetext = todo_input.value.trim();

      if (!updatetext) {
          toastr.error('Todo text cannot be empty', 'Error');
          return
      }
      const {error} = await client
         .from('Todo_list')
         .update({ Todotext: updatetext })
         .eq('id', todo[index].id);

         if (error) {
           console.log(error.message);
           
         }else{
            console.log(`Todo with id ${todo[index].id} updated successfully`);
            getshow();
            add_todo.textContent = 'Add';
            todo_input.value = '';
         }
  })
}


