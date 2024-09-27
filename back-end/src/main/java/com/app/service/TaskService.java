package com.app.service;

import java.util.List;
import org.springframework.data.domain.Page;
import com.app.dto.ApiResponseDto;
import com.app.pojo.TodoList;

public interface TaskService {

	List<TodoList> getAllTasks();
	
	TodoList addTask(TodoList todoList);
	
	TodoList updateTask(TodoList todoList);
	
	ApiResponseDto deleteTask(Long id);
	
	Page<TodoList> getTasks(int page, int size);
}
