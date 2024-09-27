import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks } from '@fortawesome/free-solid-svg-icons';

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        assignedTo: '',
        statusEnum: '',
        dueDate: '',
        priority: '',
        comments: '',
    });
    const [editingTask, setEditingTask] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalTasks, setTotalTasks] = useState(0);

    const statusOptions = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];
    const priorityOptions = ['LOW', 'NORMAL', 'HIGH'];

    useEffect(() => {
        fetchTasks();
    }, [currentPage, itemsPerPage]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/task/pages?page=${currentPage - 1}&size=${itemsPerPage}`);
            setTasks(response.data.content);
            setTotalTasks(response.data.totalElements);
        } catch (error) {
            toast.error('Error fetching tasks');
        }
    };

    const handleAddTask = async () => {
        if (!newTask.assignedTo || !newTask.statusEnum || !newTask.priority) {
            toast.error('Assigned To, Status, and Priority are required fields.');
            return;
        }

        try {
            await axios.post('http://localhost:8080/task', newTask);
            toast.success('Task added successfully');
            resetForm();
            fetchTasks();
            setShowModal(false);
        } catch (error) {
            toast.error('Error adding task');
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/task/${id}`);
            toast.success('Task deleted successfully');
            fetchTasks();
        } catch (error) {
            toast.error('Error deleting task');
        }
    };

    const handleEditTask = async () => {
        if (!newTask.assignedTo || !newTask.statusEnum || !newTask.priority) {
            toast.error('Assigned To, Status, and Priority are required fields.');
            return;
        }

        try {
            await axios.put(`http://localhost:8080/task`, newTask);
            toast.success('Task updated successfully');
            resetForm();
            fetchTasks();
            setShowModal(false);
        } catch (error) {
            toast.error('Error updating task');
        }
    };

    const resetForm = () => {
        setNewTask({
            assignedTo: '',
            statusEnum: '',
            dueDate: '',
            priority: '',
            comments: '',
        });
        setEditingTask(false);
    };

    const openEditModal = (task) => {
        setEditingTask(true);
        setNewTask(task);
        setShowModal(true);
    };

    const handleDropdownAction = (action, taskId) => {
        if (action === 'edit') {
            const taskToEdit = tasks.find(task => task.id === taskId);
            openEditModal(taskToEdit);
        } else if (action === 'delete') {
            setTaskToDelete(taskId);
            setShowDeleteConfirm(true);
        }
    };

    const confirmDelete = () => {
        deleteTask(taskToDelete);
        setShowDeleteConfirm(false);
        setTaskToDelete(null);
    };

    // Pagination controls
    const totalPages = Math.ceil(totalTasks / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mt-2 border border-dark p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
            <FontAwesomeIcon icon={faTasks} className="me-2 fa-4x" />
                <div>
                    <h3 className="d-inline">Tasks</h3>
                    <h4>All Tasks</h4>
                    <div className="text"><h5>{totalTasks} records</h5> </div>
                </div>
                <div>
                    <button className="btn btn-warning me-3" onClick={() => { resetForm(); setShowModal(true); }}>
                        New Task
                    </button>
                    <button className="btn btn-warning" onClick={fetchTasks}>
                        Refresh
                    </button>
                </div>
            </div>
            <div className="mb-2 d-flex justify-content-end">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    style={{ width: '200px', display: 'inline-block' }}
                />
            </div>
            <hr className="my-3" />
            <table className="table table-striped table-bordered border-dark">
                <thead>
                    <tr>
                        <th>Assigned To</th>
                        <th>Status</th>
                        <th>Due Date</th>
                        <th>Priority</th>
                        <th>Comments</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td>{task.assignedTo}</td>
                            <td>{task.statusEnum}</td>
                            <td>{task.dueDate}</td>
                            <td>{task.priority}</td>
                            <td>{task.comments}</td>
                            <td>
                                <div className="dropdown">
                                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                        Actions
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <li>
                                            <button className="dropdown-item" onClick={() => handleDropdownAction('edit', task.id)}>Edit</button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item" onClick={() => handleDropdownAction('delete', task.id)}>Delete</button>
                                        </li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Footer */}
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <span>Items per page: </span>
                    <select className="form-select d-inline" onChange={(e) => setItemsPerPage(e.target.value)} value={itemsPerPage} style={{ width: 'auto' }}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>
                <nav>
                    <ul className="pagination">
                        <li className="page-item">
                            <button className="page-link" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>First</button>
                        </li>
                        <li className="page-item">
                            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
                        </li>
                        <li className="page-item">
                            <span className="page-link">{currentPage}</span>
                        </li>
                        <li className="page-item">
                            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                        </li>
                        <li className="page-item">
                            <button className="page-link" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>Last</button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Modal for adding/editing a task */}
            <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} aria-hidden={!showModal}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{editingTask ? 'Edit Task' : 'Add New Task'}</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row mb-3">
                                <div className="col">
                                    <label>
                                        <span style={{ color: 'red' }}>*</span> Assigned To
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Assigned To"
                                        value={newTask.assignedTo}
                                        onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col">
                                    <label>
                                        <span style={{ color: 'red' }}>*</span> Status
                                    </label>
                                    <select
                                        className="form-select"
                                        value={newTask.statusEnum}
                                        onChange={(e) => setNewTask({ ...newTask, statusEnum: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Status</option>
                                        {statusOptions.map((status, index) => (
                                            <option key={index} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <label>Due Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={newTask.dueDate}
                                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                    />
                                </div>
                                <div className="col">
                                    <label>
                                        <span style={{ color: 'red' }}>*</span> Priority
                                    </label>
                                    <select
                                        className="form-select"
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Priority</option>
                                        {priorityOptions.map((priority, index) => (
                                            <option key={index} value={priority}>{priority}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label>Comments</label>
                                <textarea
                                    className="form-control"
                                    placeholder="Comments"
                                    value={newTask.comments}
                                    onChange={(e) => setNewTask({ ...newTask, comments: e.target.value })}
                                    rows="3"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={editingTask ? handleEditTask : handleAddTask}>
                                {editingTask ? 'Update Task' : 'Save Task'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <div className={`modal ${showDeleteConfirm ? 'show' : ''}`} style={{ display: showDeleteConfirm ? 'block' : 'none' }} aria-hidden={!showDeleteConfirm}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Deletion</h5>
                            <button type="button" className="btn-close" onClick={() => setShowDeleteConfirm(false)} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this task?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default TaskManager;