package com.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.pojo.TodoList;
import com.app.service.TaskService;

@RestController
@RequestMapping("/task")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

	@Autowired
	private TaskService taskService;
	
	@PostMapping 
	public ResponseEntity<?> addTask(@RequestBody TodoList todoList){
		return ResponseEntity.status(HttpStatus.CREATED).body(taskService.addTask(todoList));
	}
	
	@GetMapping
	public ResponseEntity<?> getAllTasks(){
		return ResponseEntity.status(HttpStatus.OK).body(taskService.getAllTasks());
	}
	
	@PutMapping
	public ResponseEntity<?> updateTask(@RequestBody TodoList todoList){
		return ResponseEntity.status(HttpStatus.OK).body(taskService.updateTask(todoList));
	}
	
	 @DeleteMapping("/{id}")
	    public ResponseEntity<?> deleteTodo(@PathVariable Long id) {
		 return ResponseEntity.status(HttpStatus.OK).body(taskService.deleteTask(id));
	 }
	 
		@GetMapping("/pages")
	    public Page<TodoList> getTasks(
	            @RequestParam(defaultValue = "0") int page,
	            @RequestParam(defaultValue = "10") int size) {
	        return taskService.getTasks(page, size);
	    }
}
