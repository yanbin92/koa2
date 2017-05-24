package sort;

import java.util.Arrays;

/**
 * 最小堆建立过程  有趣 
 * @author yanbin
 *
 */
@SuppressWarnings("unchecked")
public class MyHeap<AnyType extends Comparable<AnyType>> {
	private static final int CAPACITY = 2;

	private int size; // Number of elements in heap
	private AnyType[] heap; // The heap array


	public static void main(String args[]) {
		Integer[] arr = { 9, 3, 7, 6, 5, 1 };
		MyHeap<Integer> myHeap = new MyHeap<Integer>(arr);
		myHeap.printMinHeap();
		
		myHeap.heapSort(arr);
		System.out.println(Arrays.toString(arr));
		
		

		MyHeap<String> h = new MyHeap<String>();

	      h.insert("p");
	      h.insert("r");
	      h.insert("i");
	      h.insert("o");
	      System.out.println(h);
	      h.extractMin();
	      System.out.println(h);


	      MyHeap<Integer> tmp = new MyHeap<Integer>();
	      Integer[] a = {4,7,7,7,5,0,2,3,5,1};
	      tmp.heapSort(a);
	      System.out.println(Arrays.toString(a));
	}

	public void printMinHeap() {
		for (int i = 1;size-Math.pow(2, i-1)>0;i++) {
			for(int j=(int) Math.pow(2, i-1);j<Math.pow(2, i)&&j<=size;j++){
				System.out.print(heap[j]+"\t");
			}
			System.out.println();
		}
	}
	public MyHeap(){
	    size = 0;
		heap=(AnyType[])new Comparable[CAPACITY];
	}
	public MyHeap(AnyType[] array) {
		buildHeap(array);
	}

	private void buildHeap(AnyType[] array) {
		size = array.length;
		
		heap = (AnyType[]) new Comparable[array.length + 1];
		// heap=new AnyType[array.length+1];
		System.arraycopy(array, 0, heap, 1, array.length);
	
		
		for (int k = size / 2; k > 0; k--) {
			minHeapify(k);
		}

	}

	void minHeapify(int i) {
		int l = left(i);
		int r = right(i);
		int min;
		// (x < y) ? -1 : ((x == y) ? 0 : 1);
		if (l <= size && heap[l].compareTo(heap[i]) < 0) {// 左孩子比 parent小
			min = l;
		} else
			min = i;
		if (r <= size && heap[r].compareTo(heap[min]) < 0) {// 右孩子最小的话
			min = r;
		}
		if (min != i) {// 交换a[i]和a[min]的值 使其满足最小堆的性质
			// 交换后 下标为 min的节点值是原来的a[i] 于是已该节点为根的子树又可能违反最小堆的性质 所以 递归调用min_heapify
			exchange(min, i);
			// TODO 递归影响效率 用循环修改
			minHeapify(min);
		}
	}

	private void exchange(int min, int i) {
		AnyType temp = heap[min];
		heap[min] = heap[i];
		heap[i] = temp;
	}

	/**
	 * 返回某个节点的左孩子的pos
	 * 
	 * @param pos
	 * @return
	 */
	int left(int i) {
		return 2 * i;
	}

	int right(int i) {
		return 2 * i + 1;
	}

	int parent(int i) {
		return i / 2;
	}
	/**
	 * 将元素a[i]的关键字减小到key key<=a[i] 
	 * 		这可能会违反最小堆的性质 所以要
	 * @param i
	 * @param key
	 */
	void decreaseKey(int i,AnyType key){
		if(key.compareTo(heap[i])>0){//key>a[i]
			throw new RuntimeException();
		}
		heap[i]=key;
		while(i>1 && heap[i].compareTo(heap[parent(i)])<0){
			exchange(i,parent(i));
			i=parent(i);
		}
	}
	
	/**
	 * 最小堆的元素插入 依据最小堆的定义自底向上，递归调整。 
	 *  第二种方法 利用decreasekey来做
	 *  insert(x){
	 *   heapsize+=1
	 *   a[heapsize]=+OO  正无穷
	 *   decreaseKey(heapsize,x)
	 *   }
	 */
	void insert(AnyType x) {
		if(size==heap.length-1) doubleSize();
		size++;
		heap[size]=x;
		if(size>1)
			minHeapify(size/2);
		
	}
	private void doubleSize() {
		AnyType[] old=heap;
        heap = (AnyType []) new Comparable[heap.length * 2];
        System.arraycopy(old, 1, heap, 1, size);
//		AnyType[] newheap=new AnyType[heap.length*2];
//		System.arraycopy(old, 1, newheap, 1, heap.length);
//		heap=newheap;
	}

	/**
	 * 返回堆中最小的元素
	 * @return
	 */
	AnyType minimum(){
		return heap[1];
	}
	/**
	 * 删除并返回堆中最小的元素
	 *	最小堆的节点删除 对于最小堆和最大堆而言，删除是针对于根节点而言。 
	 * 	对于删除操作，将二叉树的最后一个节点替换到根节点，然后自顶向下，递归调整。
	 * @return
	 */
	AnyType extractMin(){
		if(size<1) throw new RuntimeException();
		AnyType min=heap[1];
		heap[1]=heap[size];
		size--;
		minHeapify(1);
		return min;
	}
	

	/**
	 * heapSort(arr){
	 *  build-min-heap(arr) 
	 *  for i = arr.length downto 2
		 *   exchange a[1] with a[i] 
		 *   a.heapsize=a.heapsize-1 
		 *   min-heapify(arr,1)
	 * }
	 * 
	 */
	void heapSort(AnyType[] array) {
		buildHeap(array);
		for(int i=size;i>1;i--){
			 exchange(1,i);
			 size--;;
			 minHeapify(1);
		}
		//将排序好的heap 重新赋值给array
		for(int k = 0; k < heap.length-1; k++)
	      array[k] = heap[heap.length - 1 - k];
	}
	
	
	 public String toString()
	   {
	      String out = "";
	      for(int k = 1; k <= size; k++) out += heap[k]+" ";
	      return out;
	   }
}
