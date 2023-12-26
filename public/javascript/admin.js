// use the imgBB api to upload an image and save the returned image url in the url input
const addImg=document.getElementById('addImage');

addImg.addEventListener('change', addImage)
async function addImage(){
const addImageInput= document.getElementById("addImage");
const file= addImageInput.files[0];

 // Create a new form data object
 const formData = new FormData();

 // resize the image using the HTML canvas api
 const resizedFile= await resizeImage(file, 800, 600);
 formData.append('image', resizedFile);

 // Use Axios to upload the image to ImgBB
 const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
   headers: {
     'content-type': 'multipart/form-data'
   },
   params: {
     key: '6ec3827f4865e3031a08d0cabde77286'
   }
 });

 // Get the image URL from the ImgBB API response
 const imgSrcInput= document.getElementById("contentImage");
 const imageUrl = response.data.data.url;
 imgSrcInput.value=imageUrl;
 alert("added")
}

// adding date for the initial post
 async function addDate(){
    const dateInput=document.getElementById('date');
    let date= new Date();
    let day=date.getDate();
    let month=date.getMonth();
    let year = date.getFullYear();
    let hours= date.getHours();
    let minutes= date.getMinutes();

    //format the day, month and year to have a zero if neccessary
    if(day < 10){
        day= '0'+ day;
    }
    if(month <10){
        month= '0'+ month
    }
    hours= (hours <10)? '0'+hours:hours;
    minutes=(minutes<10)? '0'+ minutes:minutes

    const formattedDate= day+ '/'+ month + '/'+ year +"/"+ hours+':'+minutes;
    dateInput.value=formattedDate;

}

// function to resize the image using HTML canvas
function resizeImage(file, maxWidth, maxHeight) {
  return new Promise((resolve)=>{
    const img= new Image();
    img.src = URL.createObjectURL(file);

    img.onload= ()=>{
      const canvas= document.createElement('canvas');
      let width= img.width;
      let height= img.height;

      if(width > height){
        if(width > maxWidth){
          height *= maxWidth / width;
          width= maxWidth;
        }
      }else{
        if(height > maxHeight){
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width= width;
      canvas.height= height;

      const ctx= canvas.getContext('2d');
      ctx.drawImage(img, 0 , 0, width, height);

      canvas.toBlob((blob)=>{
        resolve(new File([blob], file.name, {type: file.type}));
      }, file.type)
    };
  });
};