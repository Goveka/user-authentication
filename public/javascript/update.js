const deleteBlog= document.querySelectorAll('.delete_blog').forEach((deleteBlog)=>{
    deleteBlog.addEventListener('click', async(e)=>{
        const objectId=e.target.parentElement.id;
        alert(`you're about to DELETE the blog (id:${objectId})`)
        fetch(`/remove_blog/${objectId}`,{
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data =>{
            location.reload();
        })
        .catch(error =>{
            console.error(error)
        })
    })

})

// use the imgBB api to upload an image and save the returned image url in the url input
document.querySelectorAll('.addImage').forEach((addImg)=>{
  addImg.addEventListener('change', async (e)=>{
    const addImageInput= e.target;
    console.log(addImageInput)
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
     const imgSrcInput= e.target.nextElementSibling;
     console.log(imgSrcInput);
     const imageUrl = response.data.data.url;
     imgSrcInput.value=imageUrl;
     alert("added")
    
  })
   
})


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