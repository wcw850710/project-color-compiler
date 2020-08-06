const styles = {
  header: {
    color: '#000',
  },
  content: {
    borderColor: '#fff',
  },
  footer: {
    background: '#1c1c1c'
  }
}

export const App = () => {
  const isTrue = true
  return (
    <div id={'app'}>
      hello react!
      <header>
        <div className="logo" style={styles.header}>
          TEST_REACT_LOGO
        </div>
      </header>
      <div className="content" style={{
        color: isTrue ? 'rgba(0, 0,0 ,.5)' : 'rgba(0,0,0, .8)',
      }}>
        {isTrue ? 'papa' : 'mama'}
      </div>
      <footer></footer>
    </div>
  )
}