# Auction Portal - Semester Project 2

## Project Description

The Auction Portal is a modern web application where users can create item listings and place bids in an interactive auction environment. Users start with 1000 credits and can earn more by selling items or spend them by bidding on items created by other users. The platform features user authentication, profile management, and real-time bidding functionality.

## Live Demo

[View the live application](https://hajnalka-auction-portal.netlify.app/)

## Repository

[View the GitHub repository](https://github.com/yourusername/01_auction-portal) (Replace with your actual GitHub repository URL)

## Features

- **User Authentication**: Register and login with a valid stud.noroff.no email address
- **User Profiles**: Update your avatar and view your credit balance
- **Create Listings**: Post items for auction with images and detailed descriptions
- **Bidding System**: Place bids on items with real-time updates
- **Search Functionality**: Browse and search through all available listings
- **Credit System**: Earn credits by selling items and spend them on winning bids
- **View Bids**: See all bids placed on your listings

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Design**: Figma
- **Project Management**: Trello
- **Hosting**: Netlify

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd 01_auction-portal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add your API endpoint:
```
VITE_API_URL=https://api.noroff.dev/v1/auction
```

## Running the Project

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## How to Use

1. **Register**: Create a new account using your Noroff email address
2. **Login**: Access your account with your credentials
3. **Browse Listings**: View all available auction items on the homepage
4. **Create a Listing**: Post your own items for auction with images and descriptions
5. **Place a Bid**: Click on an item to view details and place your bid
6. **Manage Profile**: Update your avatar and monitor your credit balance

## Technical Details

- **API**: Built for the Noroff Auction API
- **Responsive Design**: Mobile-first approach ensuring compatibility across all devices
- **Error Handling**: Comprehensive error messages for better user experience
- **Performance**: Optimized with Vite for fast loading and development

## Testing the Application

For testing purposes, you can use the following credentials:
- Email: Any email ending in `@stud.noroff.no`
- Starting credits: 1000

Note: This is a Noroff course project and uses test credentials.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port.

### API Connection Issues
Ensure you have the correct API URL in your `.env` file and check your internet connection.

### Build Errors
Clear your node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Contributing

This is a course assignment project. For feedback or improvements, please refer to the original assignment requirements.

## License

This project was created as a course assignment for Noroff School of Technology and Digital Media.

## Acknowledgments

- Design inspiration and prototyping done in Figma
- Project planning and management using Trello
- Styling framework: Tailwind CSS
- Build tooling: Vite
- Hosting: Netlify
