import { useState, useEffect } from "react";
const AutoComplete = () => {
  const [inputText, setInputText] = useState('');
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(-1);
  const [originalText, setOriginalText] = useState('');
  const [isHovering, setIsHovering] = useState(-1);
  const [click, setClick] = useState(false);
  const [error, setError] = useState(false);
  const [time, setTime] = useState(60000);

  const fetchData = async ()=>{
    try{
      const response = await fetch(`https://api.github.com/search/users?q=${inputText}`);
      console.log(response);
      if(response.status!= 200){
        setError(true);
        throw new Error('Limit Exceeded');
      }else{
        const dataRes = await response.json();
        console.log(dataRes);
        const recipie = dataRes?.items.map(eachRecipe => eachRecipe.login);
        setData(recipie);
      }
    }catch(err){
      if(error){
        return;
      }
      
      let interval = setInterval(()=>{
        setTime((prev)=> {
          if(prev ==0)
          {
            clearInterval(interval);
            setError(false);
            setTime(50000);
          }
          return prev - 1000
        }
          )
      },1000);
    }
  }

  useEffect(()=>{
    if (inputText == '' || isHovering != -1) {
      return;
    }
      fetchData();
  },[inputText]);

  const handleNavigateKeys = (e)=>{
    setIsHovering(-1);
    if(e.key=='ArrowUp' && selectedItem >0){
      setSelectedItem(prev=> prev-1);
    }else if(e.key == 'ArrowDown' && selectedItem < data.length-1){
      setSelectedItem(prev=>prev+1);
    }else if(e.key =='Backspace'){
      setClick(false);
      const val = e.target.value.trim().toLowerCase();
      setInputText(val);
      setOriginalText(val);
    }
  }

  const handleMouseEnter = (index)=>{
    setInputText(data[index])
    setIsHovering(index);
    setSelectedItem(-1);
  }
  

  const handleInput = (e)=>{
      const val = e.target.value.trim().toLowerCase();
      setInputText(val);
      setOriginalText(val);
  }

  const handleMouseLeave = ()=>{
    setInputText(originalText);
  }

  const handleResultClick = (e)=>{
    setInputText(e.target.innerText);
    setOriginalText(e.target.innerText)
    setIsHovering(-1);
    setClick(true);
  }

  return (
    <div className=" w-screen flex flex-col items-center mt-24 ">
      <div className="text-4xl">AutoComplete</div>
      <input type="text" value={inputText} placeholder="Search for Github username" className="w-[700px] h-[40px] border-[1px] border-black rounded-[3px] pl-5" onKeyUp={handleNavigateKeys} onChange={handleInput}/>
      <div className="text-left w-[700px] mt-2 ">
        {
          
          (error ? (
            <div>
              <span>{time/1000}</span>
            </div>
          ): (inputText.length>0 && click == false)  &&  data.map((eachRecipe, index)=>{
            return <div className={`p-2 mb-[2px] ${ selectedItem == index || isHovering == index ? 'bg-[#f0e68c] border-[1px] border-black' : 'bg-[#f5f5dc]'} `} key={eachRecipe} onMouseEnter={()=>handleMouseEnter(index)} onMouseLeave={handleMouseLeave} onClick={handleResultClick}>{eachRecipe}</div>
          }))
        }
      </div>
    </div>
  )
}

export default AutoComplete