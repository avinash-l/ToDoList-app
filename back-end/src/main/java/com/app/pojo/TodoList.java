package com.app.pojo;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@EqualsAndHashCode
@ToString
@Entity
@Table(name = "tasks")
public class TodoList {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(length = 20) 
	private String assignedTo;
	
	@Enumerated(EnumType.STRING) 
	@Column(length = 20)
	private StatusEnum statusEnum;

	private LocalDate dueDate;
	
	@Enumerated(EnumType.STRING) 
	@Column(length = 20)
	private PriorityEnum priority;
	
	@Column(length = 100)
	private String comments;
}
