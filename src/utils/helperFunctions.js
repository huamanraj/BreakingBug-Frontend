export const timeAgo = (reviewDate) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    const reviewDateObj = new Date(reviewDate);
    const timeDifference = today - reviewDateObj;

    if (timeDifference < 60000) {
        return 'just now';
    } else if (timeDifference < 3600000) {
        const minutes = Math.floor(timeDifference / 60000);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (timeDifference < 86400000) {
        const hours = Math.floor(timeDifference / 3600000);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
        return `on ${reviewDateObj.toLocaleDateString(undefined, options)}`;
    }
};

export const generateRandomColor = (id) => {
    const hash = id.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const color = `hsl(${hash % 360}, 70%, 70%)`;
    return color;
};
//  Updated the timeAgo function to handle reviewDate correctly and fixed generateRandomColor function.