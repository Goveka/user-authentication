const inputLabel= document.getElementById('input-label');
const customFileInput= document.getElementById('addImages');
const imageName=document.getElementById('img-name');
const imageSize=document.getElementById('imgSize');
const selectedImage=document.getElementById('selectedImage');
const processedImgUrl=document.getElementById('procesedImg');
const processedImgName=document.getElementById('processed-img-name');
const procesedImgSize=document.getElementById('processed-imgSize');
const actualImgText=document.getElementById('actual-img');
const compressed_img=document.getElementById('compressed-img');
const download=document.getElementById('download');


inputLabel.addEventListener("click", ()=>{
    customFileInput.click();
})

customFileInput.addEventListener("change", displayImageAndSize)


 async function displayImageAndSize(){
    const file= customFileInput.files[0];

    if(file){
        actualImgText.textContent="Actual Image";
        compressed_img.textContent="Compressed Image"

       //getting the url of user selected image, and rendering it to the user
        const imageUrl = URL.createObjectURL(file);
        selectedImage.src = imageUrl;

        //setting the image size, and rendering it to the user
        const imagesize= (file.size / 1024).toFixed(2);
        imageSize.innerHTML= `<strong>Image Size:</strong> ${imagesize} KB`;

        //rendering the image name
        imageName.textContent= file.name;
        //calling a funtion the decreases the image size and the an object in response
        const resizedFile= await resizeImage(file, 800, 600);

        //getting the compressed img url and rendering the img to the user
        const processed_ImgUrl= URL.createObjectURL(resizedFile);
        processedImgUrl.src=processed_ImgUrl;

         //setting the compressed img size, and rendering it to the user       
        const procesed_img_size= (resizedFile.size / 1024).toFixed(2);
        procesedImgSize.innerHTML= `<strong>New Image size:</strong> ${procesed_img_size} KB`;

        // rendering compressed image name
        processedImgName.textContent= resizedFile.name; 

        //rendering the download button
        download.style.display="inline-block";
        download.href=processed_ImgUrl;

        const sized_reduced_imgs=document.getElementById('sized-reduced-imgs');
        const message=document.getElementById('message');
        message.style.display="block"
        const div= document.createElement('div');
        div.className="savedImgs"
        div.innerHTML=`<img src="${processed_ImgUrl}"><p>${resizedFile.name}</p><p>Image size:${procesed_img_size}KB
        <a href="${processed_ImgUrl}" download class="download">Download</a>`;

        //uploading the img the imgBB and saving the returned img  Url
        const formData= new FormData();
        formData.append('image', resizedFile);

        //using axios to upload the image to imgBB
        const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
          headers: {
            'content-type': 'multipart/form-data'
          },
          params: {
            key: '6471b35ba7d32dc79980a3867fd232d5'
          }
        });

        //saving the returned img url to local storage
        const returnedUrl=response.data.data.url;
        let processed_images_in_localStorage = JSON.parse(localStorage.getItem('resizedImages')) || [];
        processed_images_in_localStorage.push(returnedUrl);
        localStorage.setItem('resizedImages', JSON.stringify(processed_images_in_localStorage));
        const number_of_images=document.getElementById('number_of_images');
        let numberOfImages=processed_images_in_localStorage.length;
        number_of_images.textContent=`Number of images:${numberOfImages}`;
        number_of_images.style.display="block"

        if(processed_images_in_localStorage.length > 50){
          processed_images_in_localStorage.shift()
        }


    }else{
        selectedImage.src= "";
        imageSize.textContent= ""
    }

};


const processed_images_in_localStorage = JSON.parse(localStorage.getItem('resizedImages')) || [];
processed_images_in_localStorage.reverse();

async function processImages() {
  const sized_reduced_imgs = document.getElementById('sized-reduced-imgs');

  for (let index = 0; index < processed_images_in_localStorage.length; index++) {
    const element = processed_images_in_localStorage[index];
    const div = document.createElement('div');
    const proxyUrl = `/proxy?url=${encodeURIComponent(element)}`;

    try {
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        // Handle non-OK responses (e.g., 404)
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const imageBlob = await response.blob();
      const url = URL.createObjectURL(imageBlob);

      const anchor = document.createElement('a');
      anchor.className = 'download';
      anchor.href = url;
      anchor.download = 'downloaded_image.jpg';
      anchor.textContent = 'Download';

      div.className = 'savedImgs';
      div.innerHTML = `<img src="${url}"><p>Image size: ${imageBlob.size / 1024} KB`;
      div.appendChild(anchor);

      sized_reduced_imgs.appendChild(div);
    } catch (error) {
      console.error(error);
      console.log(processed_images_in_localStorage);
      // Handle the error and remove the image URL from the array
      processed_images_in_localStorage.splice(index, 1);
      console.log(processed_images_in_localStorage);
      localStorage.setItem('resizedImages', JSON.stringify(processed_images_in_localStorage));
    }
  }
}

processImages();


// function to resize the image using HTML canvas
function resizeImage(file, maxWidth, maxHeight) {
  return new Promise((resolve)=>{
    const img= new Image();
    img.src = URL.createObjectURL(file);

    img.onload= ()=>{
      const canvas= document.createElement('canvas');
      let width= img.width;
      let height= img.height;

      if(width > maxWidth || height > maxHeight){
        const aspectRatio= width / height;
        if(width > maxWidth){
          width= maxWidth;
          height = maxWidth / aspectRatio;
        }
      }else{
        if(height > maxHeight){
          height = maxHeight;
          width = maxHeight / aspectRatio;
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
