import { useState ,useEffect } from "react";
import Note from './Note'
import { useNavigate} from "react-router-dom";
import FloatingLabelInput from "./FloatingLabelInput";
import toast from 'react-hot-toast';


const Home = () => {
  const [user,setUser] = useState()
  const [notes,setNotes]= useState([]);
  const [content,setContent] = useState('')
  const navigate = useNavigate();

  useEffect(()=>{
    fetchNotes();
    getUser();
  },[])

  const fetchNotes = async()=>{
    try {
      const token = localStorage.getItem('jwtToken');
      if(!token){
        toast.error("Access Token not found,Please SignUp")
        return navigate("/")
      }
      const response = await fetch('http://localhost:3000/getAllNotes',{
        method:"GET",
        headers:{
          'Authorization': `Bearer ${token}`
        }
      });
    
      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message || "Error while fetching data");
      }
      const data = await response.json();
      console.log('result:',data)
      setNotes(data.notes)
    } catch (error) {
      console.log("Error:",error.message)
    }
  }
  const getUser = async()=>{
    try {
      const token = localStorage.getItem('jwtToken');
      if(!token){
        toast.error("Access Token not found,Please SignUp")
        return navigate("/")
      }
      const response = await fetch('http://localhost:3000/getUser',{
        method:"GET",
        headers:{
          'Authorization': `Bearer ${token}`
        }
      });
    
      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message || "Error while fetching User");
      }
      const data = await response.json();
      console.log('result:',data)
      setUser(data.user)
    } catch (error) {
      console.log("Error:",error.message)
    }
  }

  const createNote = async(ev)=>{
    ev.preventDefault()
    if(!content){
      toast.error("Please Provide Content")
    }
    try{
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('http://localhost:3000/create',{
      method:"POST",
      headers:{
        'Authorization': `Bearer ${token}`,
        'Content-Type':'application/json'
      },
      body:JSON.stringify({content})
    });
  
    if(!response.ok){
      const errorData = await response.json();
      throw new Error(errorData.message || "Error while creating Note");
    }
    const data = await response.json();
    console.log('result:',data)
    setNotes((prev)=>[...prev,data.note])
    setContent('')
  } catch (error) {
    console.log("Error:",error.message)
  }
  }

  const handleSignOut = async()=>{
    await localStorage.removeItem('jwtToken');
    navigate('/')
  }


  return (
    <div className='flex flex-col w-full min-h-screen gap-4 py-4 px-10'>
        <div className=' flex justify-between items-center  p-4'>
            <div className=' flex gap-2 items-center'>
            <img src="assets/icon.svg" className="w-8 h-8" />
            <h1 className=' text-lg font-semibold'>Dashboard</h1>
            </div>
            <p className='text-lg text-blue-500 cursor-pointer hover:underline' onClick={()=>handleSignOut()}>Sign Out</p>
        </div>
        <div className=' w-full h-full max-h-48 flex flex-col items-center justify-center shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] rounded-md p-6'>
            <div>
            <h1 className=' text-xl font-bold'>Welcome, {user?.name} !
            </h1>
            <p className='font-semibold'>
                Email: {user?.email}
            </p>
            </div>
        </div>
        <form className='flex flex-col sm:flex-row w-full sm:items-center justify-between gap-2 sm:gap-4' onSubmit={createNote}>
            <div className='sm:flex-[2]'>
            <FloatingLabelInput
              label="Note"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            </div>
          <button className='px-6 py-2 bg-blue-500 text-white text-lg rounded-md hover:opacity-60 sm:flex-1 mb-2' >Create Note</button>
          </form>
        <div className=' flex flex-col  gap-2 '>
          <h1 className='text-lg font-medium'>Notes</h1>
          {notes.length > 0 && 
            notes.map((note)=>(
              <Note content={note.content} key={note._id} id={note._id} fetchNotes={fetchNotes}/>
            ))
          }
        </div>
    </div>
  )
}

export default Home