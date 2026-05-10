// Role pill behaviour handled by CSS via :checked
// Password validation
const pw=document.getElementById('pw');
if(pw){
  const bar=document.querySelector('.pw-strength > span');
  const reqs=document.querySelectorAll('.req-list li');
  pw.addEventListener('input',()=>{
    const v=pw.value;
    const checks=[v.length>=8,/[A-Z]/.test(v),/[0-9]/.test(v),/[^A-Za-z0-9]/.test(v)];
    const score=checks.filter(Boolean).length;
    if(bar){
      bar.style.width=(score*25)+'%';
      bar.style.background=score<=1?'#EF4444':score===2?'#FBBF24':score===3?'#60A5FA':'#22C55E';
    }
    reqs.forEach((li,i)=>li.classList.toggle('ok',checks[i]));
  });
}
const emailInput = document.getElementById('login-email');
const pwInput = document.getElementById('login-password');
const roleRadios = document.querySelectorAll('input[name="role"]');

let credentials = [];

// Fetch credentials from the backend
fetch('../../backend/users.json')
  .then(res => res.json())
  .then(users => {
    credentials = users;
  })
  .catch(err => {
    console.warn('Could not load backend credentials, using fallbacks for local dev:', err);
    credentials = [
      { role: 'learner', email: 'umar@gmail.com', password: 'password123', dashboardUrl: '../learner/learner_dashboard.html' },
      { role: 'learner', email: 'zainab@gmail.com', password: 'password123', dashboardUrl: '../learner/learner_dashboard.html' },
      { role: 'instructor', email: 'instructor@gmail.com', password: 'password123', dashboardUrl: '../instructor/instructor_dashboard.html' },
      { role: 'admin', email: 'admin@gmail.com', password: 'password123', dashboardUrl: '../admin/admin_dashboard.html' }
    ];
  });

// Removed auto-fill logic for roles as per user request to prevent automatic credential population.

document.querySelectorAll('form').forEach(f=>{
  f.addEventListener('submit',e=>{
    e.preventDefault();
    const isLogin = !!f.querySelector('#login-password');
    
    if (isLogin) {
      const email = f.querySelector('#login-email').value.toLowerCase();
      const pass = f.querySelector('#login-password').value;
      const selectedRole = f.querySelector('input[name="role"]:checked')?.value;
      
      let matchedCred = null;
      let matchedRole = '';
      
      for (const user of credentials) {
        if (user.email.toLowerCase() === email && user.password === pass) {
          if (selectedRole && user.role !== selectedRole) continue;
          matchedCred = { url: user.dashboardUrl };
          matchedRole = user.role;
          break;
        }
      }
      
      if (!matchedCred) {
        SF.toast('Invalid email or password', 'error');
        return; // Prevent login
      }
      
      const roleName = matchedRole.charAt(0).toUpperCase() + matchedRole.slice(1);
      // Persist user info for dashboard personalisation
      const matchedUser = credentials.find(u => u.email.toLowerCase() === email);
      localStorage.setItem('sf_user_name', matchedUser?.name || roleName);
      localStorage.setItem('sf_user_role', matchedRole);
      localStorage.setItem('sf_user_email', email);
      SF.toast(`Welcome back, ${matchedUser?.name || roleName}!`, 'success');
      setTimeout(()=>location.href = matchedCred.url, 900);
      
    } else {
      // Signup form or other (forgot password)
      SF.toast('Feature unavailable', 'error');
      setTimeout(()=>location.href = '../landing/404.html', 900);
    }
  });
});
