import React from 'react'
import Delete from "./icons/Delete";

const Note = ({content,id,fetchNotes}) => {

    const handleDelete = async()=>{
        try{
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/deleteNote/${id}`,{
              method:"DELETE",
              headers:{
                'Authorization': `Bearer ${token}`,
              },
            });
          
            if(!response.ok){
              const errorData = await response.json();
              throw new Error(errorData.message || "Error while deleting Note");
            }
            const data = await response.json();
            console.log('result:',data)
            fetchNotes()
          } catch (error) {
            console.log("Error:",error.message)
          }
    }

  return (
    <div className='flex justify-between items-center px-6 py-3 rounded-md shadow-[0_0_10px_2px_rgba(0,0,0,0.2)]'>
        <p className=''>{content}</p>
        <div className='cursor-pointer'>
            <div className='p-2 rounded-full hover:bg-red-200' onClick={handleDelete}>
            <Delete/>
            </div>
        </div>
    </div>
  )
}

export default Note