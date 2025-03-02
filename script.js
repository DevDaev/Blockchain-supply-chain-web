// Initialize TransparentChain functionality
document.addEventListener('DOMContentLoaded', function() {
  // Mock blockchain data - In a real implementation, this would connect to the blockchain
  const blockchain = {
      chain: [
          {
              hash: "0x1234abcd",
              timestamp: Date.now() - 100000,
              previousHash: "0",
              transactions: "Genesis Block"
          }
      ],
      pendingTransactions: [],
      difficulty: 2,
      isValid: true
  };

  const stakeholders = {
      "MAN001": { id: "MAN001", name: "TechManufacturing Inc.", role: "manufacturer", products: [] },
      "DIST001": { id: "DIST001", name: "Global Distribution Services", role: "distributor", products: [] },
      "RET001": { id: "RET001", name: "Consumer Tech Shop", role: "retailer", products: [] }
  };

  const products = {
      "PROD001": {
          id: "PROD001",
          name: "High-Performance Laptop",
          manufacturer: "MAN001",
          supplyChainHistory: [],
          currentOwner: "MAN001",
          currentLocation: "Shanghai, China"
      }
  };

  const events = [
      {
          timestamp: Date.now() - 86400000,
          location: "Shanghai, China",
          action: "MANUFACTURED",
          handler: "MAN001",
          itemId: "PROD001",
          eventId: "event001"
      },
      {
          timestamp: Date.now() - 43200000,
          location: "Shanghai Port, China",
          action: "SHIPPED",
          handler: "MAN001",
          itemId: "PROD001",
          eventId: "event002"
      },
      {
          timestamp: Date.now() - 21600000,
          location: "Los Angeles Port, USA",
          action: "RECEIVED",
          handler: "DIST001",
          itemId: "PROD001",
          eventId: "event003"
      }
  ];

  // Add events to product history
  products["PROD001"].supplyChainHistory = events;
  products["PROD001"].currentOwner = "DIST001";
  products["PROD001"].currentLocation = "Los Angeles Port, USA";

  // Add product to stakeholder's products
  stakeholders["MAN001"].products.push("PROD001");
  stakeholders["DIST001"].products.push("PROD001");

  // Add transactions to blockchain
  blockchain.chain.push({
      hash: "0x5678efgh",
      timestamp: Date.now() - 86400000,
      previousHash: "0x1234abcd",
      transactions: ["Register Product PROD001", "Manufactured PROD001"]
  });

  blockchain.chain.push({
      hash: "0x9012ijkl",
      timestamp: Date.now() - 43200000,
      previousHash: "0x5678efgh",
      transactions: ["Shipped PROD001", "Transfer Ownership PROD001"]
  });

  // Navigation functionality
  const panels = ["dashboard", "product", "stakeholders", "blockchain"];
  
  panels.forEach(panel => {
      document.getElementById(`nav-${panel}`).addEventListener('click', function(e) {
          e.preventDefault();
          panels.forEach(p => {
              document.getElementById(`${p}-panel`).style.display = 'none';
              document.getElementById(`nav-${p}`).classList.remove('active');
          });
          document.getElementById(`${panel}-panel`).style.display = 'block';
          this.classList.add('active');
      });
  });

  // Tab functionality
  document.querySelectorAll('.tab-header').forEach(tab => {
      tab.addEventListener('click', function() {
          const tabId = this.getAttribute('data-tab');
          
          document.querySelectorAll('.tab-header').forEach(t => {
              t.classList.remove('active');
          });
          document.querySelectorAll('.tab-panel').forEach(p => {
              p.classList.remove('active');
          });
          
          this.classList.add('active');
          document.getElementById(`${tabId}-panel`).classList.add('active');
      });
  });

  // Dashboard data
  document.getElementById('total-products').textContent = Object.keys(products).length;
  document.getElementById('total-stakeholders').textContent = Object.keys(stakeholders).length;
  document.getElementById('blockchain-status').textContent = blockchain.isValid ? 'Valid' : 'Invalid';
  document.getElementById('last-verified').textContent = new Date().toLocaleTimeString();

  // Recent transactions
  const transactionsTable = document.getElementById('recent-transactions');
  events.slice().reverse().forEach(event => {
      const row = document.createElement('tr');
      
      const timestamp = document.createElement('td');
      timestamp.textContent = new Date(event.timestamp).toLocaleString();
      
      const productId = document.createElement('td');
      productId.textContent = event.itemId;
      
      const action = document.createElement('td');
      action.textContent = event.action.replace('_', ' ');
      
      const location = document.createElement('td');
      location.textContent = event.location;
      
      const handler = document.createElement('td');
      handler.textContent = stakeholders[event.handler]?.name || event.handler;
      
      const status = document.createElement('td');
      const badge = document.createElement('span');
      badge.classList.add('badge');
      
      switch(event.action) {
          case 'MANUFACTURED':
              badge.classList.add('badge-primary');
              badge.textContent = 'Created';
              break;
          case 'SHIPPED':
              badge.classList.add('badge-warning');
              badge.textContent = 'In Transit';
              break;
          case 'RECEIVED':
              badge.classList.add('badge-success');
              badge.textContent = 'Received';
              break;
          case 'QUALITY_CHECKED':
              badge.classList.add('badge-primary');
              badge.textContent = 'Verified';
              break;
          case 'OWNERSHIP_TRANSFER':
              badge.classList.add('badge-primary');
              badge.textContent = 'Transferred';
              break;
          default:
              badge.classList.add('badge-secondary');
              badge.textContent = 'Unknown';
      }
      
      status.appendChild(badge);
      
      row.appendChild(timestamp);
      row.appendChild(productId);
      row.appendChild(action);
      row.appendChild(location);
      row.appendChild(handler);
      row.appendChild(status);
      
      transactionsTable.appendChild(row);
  });

  // Product search functionality
  document.getElementById('product-search-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const productId = document.getElementById('product-id').value;
      
      if (products[productId]) {
          document.getElementById('product-details').style.display = 'block';
          
          // Product info
          document.getElementById('product-detail-id').textContent = products[productId].id;
          document.getElementById('product-detail-name').textContent = products[productId].name;
          document.getElementById('product-detail-manufacturer').textContent = stakeholders[products[productId].manufacturer]?.name || products[productId].manufacturer;
          document.getElementById('product-detail-current-owner').textContent = stakeholders[products[productId].currentOwner]?.name || products[productId].currentOwner;
          document.getElementById('product-detail-current-location').textContent = products[productId].currentLocation;
          
          // Timeline
          const timeline = document.getElementById('product-timeline');
          timeline.innerHTML = '';
          
          products[productId].supplyChainHistory.forEach(event => {
              const timelineItem = document.createElement('div');
              timelineItem.classList.add('timeline-item');
              
              const timelinePoint = document.createElement('div');
              timelinePoint.classList.add('timeline-point');
              
              const timelineContent = document.createElement('div');
              timelineContent.classList.add('timeline-content');
              
              const timelineDate = document.createElement('div');
              timelineDate.classList.add('timeline-date');
              timelineDate.textContent = new Date(event.timestamp).toLocaleString();
              
              const timelineTitle = document.createElement('div');
              timelineTitle.classList.add('timeline-title');
              timelineTitle.textContent = event.action.replace('_', ' ');