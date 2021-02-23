let basePath = `${process.env.VUE_APP_BASE_URL}/image`;

export const getPicturePath = (picturePath) => {
    let url = `${basePath}/${picturePath}`;
    return url;
}