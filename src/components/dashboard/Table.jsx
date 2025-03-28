"use client";
import React, { useEffect, useState } from "react";
import { FaArrowUp, FaSearch } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa6";

import { HiDotsVertical } from "react-icons/hi";

import { PinIcon, RedirectIcon } from "../ui/icons";
import Modal from "./Modal";
import CreateWorkflowForm from "./CreateWorkflow";
import EditWorkflowForm from "./EditWorkflowForm";

export default function WorkflowTable() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [executeModal, setExecuteModal] = useState(false);
  const [options, setOptions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const limit = 5;
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkflows = async (page) => {
    const res = await fetch(`/api/workflows?page=${page}&limit=${limit}&search=${search}`);
    const data = await res.json();

    setData(data.workflows);
    setIsLoading(false);
    setTotalPages(data.totalPages);
    setCurrentPage(data.currentPage);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchWorkflows(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  const toggleFavorite = (id) => {
    setData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  const handleSelect = (id) => {
    setSelectedWork(id);
    setExecuteModal(true);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearch(query);
  };

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleExecute = async (id) => {
    setExecuteModal(false);
    setLoadingId(id);

    try {
      const response = await fetch("/api/workflows/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: Math.random() > 0.5 ? "Passed" : "Failed",
        }),
      });

      if (!response.ok) throw new Error("Execution failed");

      const updatedWorkflow = await response.json();

      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, executions: updatedWorkflow.executions } : item
        )
      );
    } catch (error) {
      console.error("Execution error:", error);
    } finally {
      setTimeout(() => setLoadingId(null), 500);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md font-poppins">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-96 mb-4 flex items-center">
          <input
            type="text"
            onChange={handleSearch}
            placeholder="Search By Workflow Name/ID"
            className="w-full p-2  border rounded-md"
          />
          <p className="absolute right-8 text-gray-300 text-xl">
            <FaSearch />
          </p>
        </div>
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 "
          onClick={() => setIsModalOpen(true)}
        >
          + Create New Process
        </button>
      </div>

      {isLoading ? (
        <div>
          <h4 className="text-4xl font-bold italic text-center">Loading ...</h4>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-left">
            <thead className="border-b-2 border-amber-500 border-solid">
              <tr>
                <th className="p-3 border-b">Workflow Name</th>
                <th className="p-3 border-b">ID</th>
                <th className="p-3 border-b">Last Edited On</th>
                <th className="p-3 border-b">Description</th>
                <th className="p-3 border-b text-center"></th>
              </tr>
            </thead>

            <tbody className="font-poppins text-[#4F4F4F]">
              {data.map((item, index) => (
                <React.Fragment key={item.id}>
                  <tr className="border-b">
                    <td className="p-3">{item.workflowName}</td>
                    <td className="p-3">#{item.id}</td>
                    <td className="p-3">{item.lastEdited}</td>
                    <td className="p-2 max-w-[800px]">{item.description}</td>
                    <td className="p-3 flex items-center gap-6 justify-end">
                      <button onClick={() => toggleFavorite(item.id)} className="mx-4">
                        {item.isFavorite ? <PinIcon color="#fff200" /> : <PinIcon color="#fff" />}
                      </button>

                      <button
                        onClick={() => handleSelect(index)}
                        className="border border-[#E0E0E0] px-4 py-1 rounded-lg text-sm"
                      >
                        {loadingId === item.id ? "Executing..." : "Execute"}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedWork(index);
                          setEditModal(!editModal);
                        }}
                        className="border border-[#E0E0E0] px-4 py-1 rounded-lg text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setSelectedWork(index);
                          setOptions(!options);
                        }}
                      >
                        <HiDotsVertical className="text-lg" />
                        {options && selectedWork === index && (
                          <div className="bg-white shadow-xl p-4 absolute cursor-pointer">
                            <div
                              className="text-red-500 underline"
                              onClick={() => setDeleteModal(true)}
                            >
                              Delete
                            </div>
                          </div>
                        )}
                      </button>

                      {/* Expand/Collapse Button */}
                      <button onClick={() => toggleExpand(item.id)}>
                        {expandedRow === item.id ? (
                          <FaArrowUp className="text-lg" />
                        ) : (
                          <FaArrowDown className="text-lg" />
                        )}
                      </button>
                    </td>
                  </tr>

                  {expandedRow === item.id && (
                    <tr>
                      <td colSpan="5" className="p-4 bg-orange-50 border-t">
                        <h3 className="font-semibold">Execution History</h3>
                        <div className="mt-2 space-y-2">
                          {item.executions.length > 0 ? (
                            item.executions.map((execution, index) => (
                              <div key={index} className="flex items-center space-x-4 space-y-8 ">
                                <span className="w-4 h-4 flex relative top-2 items-center justify-center border-primary border-solid border-2 rounded-full after:pb-8 after:bg-red-500 after:content-[''] after:h-8">
                                  <div className="w-2 h-2 bg-primary rounded-full relative">
                                    {item.executions.length - 1 !== index && (
                                      <span className="h-16 w-1 bg-primary absolute left-1/2 -translate-x-1/2" />
                                    )}
                                  </div>
                                </span>

                                <div className="grid grid-cols-3 gap-x-4">
                                  <p>{item.lastEdited} IST</p>
                                  <p
                                    className={`px-2 py-1 text-sm rounded ${
                                      execution.status === "Passed"
                                        ? "bg-green-200 text-green-800"
                                        : "bg-red-200 text-red-800"
                                    }`}
                                  >
                                    {execution.status}
                                  </p>
                                  <p className="">
                                    <RedirectIcon />
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500">No executions available.</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-end my-8 space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          className="px-3 py-1 border rounded-md hover:bg-gray-100"
        >
          ◀
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const pageNum = index + 1;
          return (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === pageNum ? "bg-background text-white" : "hover:bg-gray-100"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          className="px-3 py-1 border rounded-md hover:bg-gray-100"
        >
          ▶
        </button>
      </div>
      <Modal
        isOpen={editModal}
        onClose={() => {
          setEditModal(false);
          setSelectedWork(null);
        }}
      >
        <EditWorkflowForm
          workflow={data[selectedWork]}
          onClose={() => {
            setEditModal(false);
            setSelectedWork(null);
          }}
          refreshData={fetchWorkflows}
        />
      </Modal>

      <Modal
        isOpen={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setSelectedWork(null);
        }}
      >
        <div className="p-16 px-32 text-center relative">
          <h4>"Are you sure you want to Delete the process {data[selectedWork]?.workflowName}?</h4>
          <h5 className="text-red-500 my-4">You cannot Undo this step</h5>
          <div className="absolute bottom-0 right-4 flex gap-x-4">
            <button className="px-2 cursor-pointer py-1 border-2 border-[#E0E0E0] border-solid hover:bg-background hover:text-foreground rounded-lg">
              Yes
            </button>
            <button
              onClick={() => {
                setDeleteModal(false);
                setSelectedWork(null);
              }}
              className="px-2 cursor-pointer py-1 border-2 border-[#E0E0E0] border-solid hover:bg-background hover:text-foreground rounded-lg"
            >
              No
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={executeModal}
        onClose={() => {
          setExecuteModal(false);
          setSelectedWork(null);
        }}
      >
        <div className="p-16 px-32 text-center relative">
          <h4>"Are you sure you want to Execute the process {data[selectedWork]?.workflowName}?</h4>
          <h5 className="text-red-500 my-4">You cannot Undo this step</h5>
          <div className="absolute bottom-0 right-4 flex gap-x-4">
            <button
              className="px-2 cursor-pointer py-1 border-2 border-[#E0E0E0] border-solid hover:bg-background hover:text-foreground rounded-lg"
              onClick={() => handleExecute(data[selectedWork].id)}
            >
              Yes
            </button>
            <button
              onClick={() => {
                setExecuteModal(false);
                setSelectedWork(null);
              }}
              className="px-2 cursor-pointer py-1 border-2 border-[#E0E0E0] border-solid hover:bg-background hover:text-foreground rounded-lg"
            >
              No
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CreateWorkflowForm
          refreshData={() => fetchWorkflows(currentPage)}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
