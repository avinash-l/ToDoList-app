package com.app.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.pojo.TodoList;

public interface TaskDao extends JpaRepository<TodoList, Long> {

	
}
