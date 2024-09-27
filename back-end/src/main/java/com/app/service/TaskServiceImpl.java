package com.app.service;


import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dao.TaskDao;
import com.app.dto.ApiResponseDto;
import com.app.pojo.TodoList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {

	@Autowired
	private TaskDao taskDao;

	@Override
	public List<TodoList> getAllTasks() {
		// TODO Auto-generated method stub
		return taskDao.findAll();
	}


	@Override
	public TodoList addTask(TodoList transientTodoList) {
		return taskDao.save(transientTodoList);
	}

	@Override
	public TodoList updateTask(TodoList detachedTodoList) {
	    if (detachedTodoList == null || detachedTodoList.getId() == null) {
	        throw new IllegalArgumentException("TodoList and its ID must not be null.");
	    }

	    if (taskDao.existsById(detachedTodoList.getId())) {
	        return taskDao.save(detachedTodoList);
	    } else {
	        throw new NoSuchElementException("TodoList not found with ID: " + detachedTodoList.getId());
	    }
	}


	@Override
	public ApiResponseDto deleteTask(Long id) {
		if(taskDao.existsById(id)) {
			taskDao.deleteById(id);
			return new ApiResponseDto("Task Deleted Succesfully!");
		}
		return new ApiResponseDto("Invalid Id");
	}
	
	@Override
    public Page<TodoList> getTasks(int page, int size) {
        return taskDao.findAll(PageRequest.of(page, size));
    }

}
